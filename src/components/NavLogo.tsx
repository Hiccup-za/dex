export default function NavLogo() {
  return (
    <div className="nav-logo">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/master-ball.png"
        alt="Master Ball"
        className="nav-logo-img"
      />
      <span className="nav-title">DEX</span>
    </div>
  );
}
