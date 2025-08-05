const determineLastDot = (message: string) => {
  return `${message.endsWith(".") ? message.trim() : message.trim() + "."}`;
};

export const RZL_NEXT_EXTRA = {
  NAME: "RZL_NEXT_EXTRA",
  ERROR: {
    PROPS_MESSAGE: (message: string) => {
      return `[${RZL_NEXT_EXTRA.NAME} - Error]: ${determineLastDot(message)}`;
    },
    FLAG_MESSAGE: (message: string) => {
      return `[${RZL_NEXT_EXTRA.NAME} - Error]: ${determineLastDot(message)} \nThis may happen if you're using '--turbo' or '--turbopack', which is currently not supported by 'next-extra'. Please run the dev server without the turbo flag.`;
    }
  }
} as const;
