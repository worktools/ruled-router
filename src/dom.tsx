import React, { FC, ReactNode, useEffect, useRef } from "react";

import { cx, css } from "@emotion/css";
import { GlobalThemeVariables } from "./theme";

export let HashLink: FC<{
  to: string;
  noHashPrefix?: boolean; // No default "#" prefix required
  text?: string;
  title?: string;
  className?: string;
  children?: ReactNode[];
}> = (props) => {
  return (
    <a
      onClick={(event) => {
        event.preventDefault();

        if (props.noHashPrefix) {
          window.location.href = props.to;
          return;
        }

        window.location.hash = props.to;
      }}
      href={props.noHashPrefix ? props.to : `#${props.to}`}
      title={props.title}
      className={cx(styleAButton, GlobalThemeVariables.link, props.className)}
    >
      {props.text || props.children}
    </a>
  );
};

export let HashRedirect: FC<{
  to: string;
  delay?: number;
  noDelay?: boolean;
  className?: string;
  children?: ReactNode[];
}> = (props) => {
  let timing = useRef(null as NodeJS.Timeout);
  let delay = props.noDelay ? 0 : (props.delay != null ? props.delay : 0.4) * 1000;

  useEffect(() => {
    // in case there is an old timer
    clearInterval(timing.current);

    timing.current = setTimeout(() => {
      window.location.replace(`${window.location.origin}${location.pathname}#${props.to}`);
    }, delay);

    return () => {
      if (timing.current) {
        clearInterval(timing.current);
      }
    };
  }, [props.to]);

  return <div className={props.className}>{props.children}</div>;
};

interface FakeRouteOperator {
  name: string;
  raw: string;
  path: (...xs: string[]) => string;
  go: (...xs: string[]) => void;
}

/** find a route target dynamically,
 * @param branch refers to parent branch of candidate route items.
 * since it's dynamic, types does not ensure correctness.
 */
export let findRouteTarget = (branch: { [name: string]: any }, path: string): FakeRouteOperator => {
  for (let k in branch) {
    let item: FakeRouteOperator = branch[k];
    if (item != null && item.name != null && item.go != null) {
      if (item.name === path) {
        return item;
      }
    }
  }
  console.warn("Found no matching route item:", path, "in", branch);
  return null;
};

let styleAButton = css`
  color: #3674ff;
  &:hover {
    color: #729dff;
  }
`;
