"use client";

import dynamic from "next/dynamic";
import React from "react";

const SeasonalAnimations = dynamic(() => import("./SeasonalAnimations"), {
  ssr: false,
});

const SeasonalAnimationsWrapper = ({
  season,
}: {
  season: "christmas" | "newYear" | null;
}) => {
  if (!season) return null;
  return <SeasonalAnimations season={season} />;
};

export default SeasonalAnimationsWrapper;
