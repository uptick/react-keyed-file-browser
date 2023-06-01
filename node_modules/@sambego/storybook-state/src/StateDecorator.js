import React from "react";
import State from "./State";
import { makeDecorator } from "@storybook/addons";

export default makeDecorator({
  name: "StateDecorator",
  parameterName: "state",
  wrapper: (storyFn, context, { parameters }) => {
    if (parameters && parameters.store) {
      return (
        <State store={parameters.store} parseState={parameters.parseState}>
          {storyFn(context)}
        </State>
      );
    }

    return storyFn(context);
  }
});
