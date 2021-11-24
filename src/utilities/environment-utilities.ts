import { NickFlow } from "../NickFlow";
import { SpicyFlow } from "../SpicyFlow";

export const GetUserPath = () => {
  switch (process.env.USERPATH) {
    case "Spicy": {
      return SpicyFlow;
    }
    case "Nick": {
      return NickFlow;
    }
    default: {
      return NickFlow;
    }
  }
};
