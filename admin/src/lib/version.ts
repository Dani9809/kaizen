/**
 * KAIZEN System Versioning
 * Centralized source of truth for the application's build version.
 */

export const APP_VERSION = {
  major: 0,
  minor: 1,
  patch: 7,
  suffix: "STABLE",
};

/**
 * Returns the formatted version string
 */
export const getAppVersion = () => {
  const { major, minor, patch, suffix } = APP_VERSION;
  return `v${major}.${minor}.${patch}${suffix ? `-${suffix}` : ""}`;
};
