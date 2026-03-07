import { NextResponse } from "next/server";

const IMAGE_BASE = "https://images.igdb.com/igdb/image/upload/t_cover_big";

async function getTwitchToken(): Promise<string> {
  const res = await fetch("https://id.twitch.tv/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.TWITCH_CLIENT_ID!,
      client_secret: process.env.TWITCH_CLIENT_SECRET!,
      grant_type: "client_credentials",
    }),
    next: { revalidate: 3600 },
  });

  const data = await res.json();
  return data.access_token as string;
}

export async function GET() {
  const clientId = process.env.TWITCH_CLIENT_ID;
  const clientSecret = process.env.TWITCH_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.json(
      { error: "Missing Twitch credentials" },
      { status: 500 }
    );
  }

  try {
    const token = await getTwitchToken();

    const res = await fetch("https://api.igdb.com/v4/games", {
      method: "POST",
      headers: {
        "Client-ID": clientId,
        Authorization: `Bearer ${token}`,
        "Content-Type": "text/plain",
      },
      body: `fields name,cover.image_id;
where name = "Pokémon FireRed Version" | name = "Pokémon LeafGreen Version";
limit 2;`,
      next: { revalidate: 86400 },
    });

    const games = (await res.json()) as Array<{
      name: string;
      cover?: { image_id: string };
    }>;

    const result: { fr: string | null; lg: string | null } = {
      fr: null,
      lg: null,
    };

    for (const game of games) {
      if (!game.cover?.image_id) continue;
      const url = `${IMAGE_BASE}/${game.cover.image_id}.jpg`;
      if (game.name.toLowerCase().includes("firered")) {
        result.fr = url;
      } else if (game.name.toLowerCase().includes("leafgreen")) {
        result.lg = url;
      }
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error("game-covers error:", err);
    return NextResponse.json({ error: "Failed to fetch covers" }, { status: 500 });
  }
}
