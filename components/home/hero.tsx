import { HeroName } from "@/components/home/hero-name";
import { Rotator } from "@/components/home/rotator";
import { SystemStatus } from "@/components/home/system-status";
import { profile } from "@/data/profile";

function coords() {
  const { lat, lon } = profile.location.coordinates;
  return `${lat.toFixed(4)}° N  ${lon.toFixed(4)}° E`;
}

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="frame flex min-h-[100svh] flex-col pb-[clamp(28px,4vw,56px)] pt-[calc(var(--header-h)+clamp(20px,3.2vw,48px))]">
      {/* Metadata strip */}
      <div className="t-meta grid-12 load-fade text-muted" style={{ ["--i" as string]: 0 } as React.CSSProperties}>
        <p className="col-span-6 md:col-span-3">
          <span className="text-ink">FH</span>—000 / Index
        </p>
        <p className="hidden md:col-span-3 md:block">{coords()}</p>
        <p className="hidden md:col-span-3 md:block">{profile.disciplines.join(" / ")}</p>
        <p className="col-span-6 text-right md:col-span-3">
          {profile.location.city}, {profile.location.country}
        </p>
      </div>

      {/* Name */}
      <h1
        id="hero-title"
        data-spec="H1 / Geist 600 / 13.4vw"
        className="t-display mt-[clamp(28px,5vw,72px)] text-[22vw] text-ink sm:text-[clamp(64px,13.4vw,340px)]"
      >
        <HeroName name={profile.name} />
      </h1>

      <div className="flex-1" />

      {/* Statement + status */}
      <div className="grid-12 mt-[clamp(40px,7vw,120px)] items-end gap-y-12">
        <div className="col-span-12 lg:col-span-7">
          <p
            data-spec="Statement / Instrument Serif"
            className="t-serif text-[clamp(38px,5vw,96px)] leading-[0.98] tracking-[-0.025em]"
          >
            {profile.statement.map((line, i) => (
              <span key={line} className={`load-line ${i === 1 ? "pl-[1.6em] sm:pl-[2.4em]" : ""}`}>
                <span style={{ ["--i" as string]: i + 2 } as React.CSSProperties}>
                  {i === 1 ? <em className="italic">{line}</em> : line}
                </span>
              </span>
            ))}
          </p>
          <div
            className="load-fade mt-[clamp(24px,3vw,44px)] max-w-[44ch] text-[clamp(16px,1.15vw,19px)] leading-snug tracking-[-0.012em]"
            style={{ ["--i" as string]: 6 } as React.CSSProperties}
          >
            <Rotator phrases={profile.rotations} />
          </div>
        </div>

        <div className="load-fade col-span-12 md:col-span-7 lg:col-span-4 lg:col-start-9" style={{ ["--i" as string]: 7 } as React.CSSProperties}>
          <SystemStatus />
        </div>
      </div>

      <div className="t-meta grid-12 mt-[clamp(40px,5vw,72px)] items-end text-muted">
        <p className="col-span-8 md:col-span-6">{profile.role}</p>
        <a
          href="#work"
          className="col-span-4 -my-3 inline-flex min-h-[44px] items-center justify-end gap-2 justify-self-end text-ink hover:text-blue md:col-span-6"
        >
          Index <span aria-hidden="true">↓</span>
        </a>
      </div>
    </section>
  );
}
