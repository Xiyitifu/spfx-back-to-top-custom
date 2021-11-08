import { Icon, IconButton } from "office-ui-fabric-react";
import * as React from "react";
import * as ReactDOM from "react-dom";
import styles from "./BackToTop.module.scss";
import IBackToTopProps from "./IBackToTopProps";

export const BackToTop = ({ currentUrl }: IBackToTopProps) => {
  const [showButton, setShowButton] = React.useState(false);
  let scrollContainer = document.querySelector(
    '[data-automation-id="contentScrollRegion"]'
  );

  const onScroll = () => {
    if (scrollContainer && scrollContainer.scrollTop > 300) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  };

  const goToTop = () => {
    scrollContainer.scrollTop = 0;
    setTimeout(() => {
      scrollContainer.scrollTop = 0; // first scroll doesn't go to the very top.
    }, 50);
  };

  React.useEffect(() => {
    let domNode = ReactDOM.findDOMNode(scrollContainer);
    domNode.addEventListener("scroll", onScroll);
    onScroll();
    return () => domNode.removeEventListener("scroll", onScroll);
  }, [currentUrl]);

  return (
    <React.Fragment>
      {showButton && (
        <div className={styles.backToTop}>
          <IconButton
            className={styles.iconButton}
            onClick={goToTop}
            ariaLabel="Back to Top"
          >
            <Icon iconName="Up" className={styles.icon}></Icon>
          </IconButton>
        </div>
      )}
    </React.Fragment>
  );
};
