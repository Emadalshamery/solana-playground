import { useCallback, useState } from "react";
import styled, { css, keyframes } from "styled-components";

import { SpinnerWithBg } from "../../../../../components/Loading";
import { EventName } from "../../../../../constants";
import {
  PgCommon,
  PgRouter,
  PgTheme,
  SetElementAsync,
} from "../../../../../utils/pg";
import { useGetAndSetStatic } from "../../../../../hooks";

const MainView = () => {
  const [El, setEl] = useState<JSX.Element | null>(null);
  const [loading, setLoading] = useState(true);

  const setElWithTransition = useCallback(
    async (SetEl: SetElementAsync) => {
      setLoading(true);

      const TransitionedEl = await PgCommon.transition(async () => {
        try {
          return await (
            SetEl as (El: JSX.Element | null) => Promise<JSX.Element>
          )(El);
        } catch (e: any) {
          console.log("MAIN VIEW ERROR:", e.message);
          PgRouter.navigate();
        }
      }, 300);
      if (TransitionedEl) setEl(TransitionedEl);

      setLoading(false);
    },
    [El]
  );

  useGetAndSetStatic(El!, setElWithTransition, EventName.VIEW_MAIN_STATIC);

  return (
    <Wrapper>
      <StyledSpinnerWithBg loading={loading} size="2rem">
        {El}
      </StyledSpinnerWithBg>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  ${({ theme }) => css`
    ${PgTheme.getScrollbarCSS({ allChildren: true })};
    ${PgTheme.convertToCSS(theme.components.main.default)};
  `}
`;

const StyledSpinnerWithBg = styled(SpinnerWithBg)`
  ${({ theme }) => css`
    width: 100%;

    & > div:last-child {
      flex: 1;
      opacity: 0;
      animation: ${fadeInAnimation} ${theme.default.transition.duration.long}
        ${theme.default.transition.type} forwards;
    }
  `}
`;

const fadeInAnimation = keyframes`
  0% { opacity: 0 }
  40% { opacity : 0 }
  100% { opacity: 1 }
`;

export default MainView;
