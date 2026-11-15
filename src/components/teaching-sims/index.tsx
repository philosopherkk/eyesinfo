import { TeachingSimFrame } from "./teaching-sim-frame";

export function PresbyopiaSim() {
  return (
    <TeachingSimFrame
      htmlFile="presbyopia-sim.html"
      iframeId="eyesinfo-presbyopia-sim"
      titleKey="teachPresbyopiaTitle"
      captionKey="teachPresbyopiaCaption"
      footKey="teachPresbyopiaFoot"
    />
  );
}

export function AstigmatismSim() {
  return (
    <TeachingSimFrame
      htmlFile="astigmatism-sim.html"
      iframeId="eyesinfo-astigmatism-sim"
      titleKey="teachAstigmatismTitle"
      captionKey="teachAstigmatismCaption"
      footKey="teachAstigmatismFoot"
    />
  );
}

export function TearFilmSim() {
  return (
    <TeachingSimFrame
      htmlFile="tear-film-sim.html"
      iframeId="eyesinfo-tear-film-sim"
      titleKey="teachTearFilmTitle"
      captionKey="teachTearFilmCaption"
      footKey="teachTearFilmFoot"
    />
  );
}

export function PalZonesSim() {
  return (
    <TeachingSimFrame
      htmlFile="pal-zones-sim.html"
      iframeId="eyesinfo-pal-zones-sim"
      titleKey="teachPalZonesTitle"
      captionKey="teachPalZonesCaption"
      footKey="teachPalZonesFoot"
      tall
    />
  );
}

export function ClOverwearSim() {
  return (
    <TeachingSimFrame
      htmlFile="cl-overwear-sim.html"
      iframeId="eyesinfo-cl-overwear-sim"
      titleKey="teachClOverwearTitle"
      captionKey="teachClOverwearCaption"
      footKey="teachClOverwearFoot"
    />
  );
}

export function ShallowAcSim() {
  return (
    <TeachingSimFrame
      htmlFile="shallow-ac-sim.html"
      iframeId="eyesinfo-shallow-ac-sim"
      titleKey="teachShallowAcTitle"
      captionKey="teachShallowAcCaption"
      footKey="teachShallowAcFoot"
    />
  );
}

export function AxialLengthSim() {
  return (
    <TeachingSimFrame
      htmlFile="axial-length-sim.html"
      iframeId="eyesinfo-axial-length-sim"
      titleKey="teachAxialLengthTitle"
      captionKey="teachAxialLengthCaption"
      footKey="teachAxialLengthFoot"
    />
  );
}
