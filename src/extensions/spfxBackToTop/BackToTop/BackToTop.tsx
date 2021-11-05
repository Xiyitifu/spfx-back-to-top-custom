import * as React from "react";
import styles from "./BackToTop.module.scss";
import { IconButton, Icon } from "office-ui-fabric-react";
import IBackToTopProps from "./IBackToTopProps";
import IBackToTopState from "./IBackToTopState";

export default class BackToTop extends React.Component<
  IBackToTopProps,
  IBackToTopState
> {
  constructor(props) {
    super(props);
    this.state = {
      showButton: false,
    };

    // Register the onscroll even handler
    if (this.props.scrollContainer) {
      this.props.scrollContainer.onscroll = this._onScroll;
    }
  }

  private _onScroll = () => {
    this.setState({
      showButton: this.props.scrollContainer.scrollTop > 20,
    });
  };

  private _goToTop = () => {
    this.props.scrollContainer.scrollTop = 0;
    setTimeout(() => {
      this.props.scrollContainer.scrollTop = 0; // first scroll doesn't go to the very top.
    }, 50);
  };

  public render(): JSX.Element {
    return (
      <React.Fragment>
        {this.state.showButton && (
          <div className={styles.backToTop}>
            <IconButton
              className={styles.iconButton}
              onClick={this._goToTop}
              ariaLabel="Back to Top"
            >
              <Icon iconName="Up" className={styles.icon}></Icon>
            </IconButton>
          </div>
        )}
      </React.Fragment>
    );
  }

  public componentWillReceiveProps(nextProps: IBackToTopProps) {
    if (this.props.currentUrl != nextProps.currentUrl) {
      this._onScroll();
    }
  }
}
