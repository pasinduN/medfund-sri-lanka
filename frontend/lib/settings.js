// Donor rules live in one place. Later an admin will change these from a settings page (saved in MySQL).
export const DONOR_SETTINGS = {
  // NBTS Sri Lanka: a donor can give whole blood once every 4 months
  bloodWaitDays: 120,
  // reward badges count donations inside this window, then start again from zero
  rewardPeriodMonths: 12,
};

export const REWARD_TIERS = [
  { min: 1, key: "tier_bronze", icon: "🥉" },
  { min: 2, key: "tier_silver", icon: "🥈" },
  { min: 3, key: "tier_gold", icon: "🥇" },
];