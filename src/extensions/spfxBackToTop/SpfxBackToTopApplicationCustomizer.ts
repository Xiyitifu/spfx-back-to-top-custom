import { override } from "@microsoft/decorators";
import {
  BaseApplicationCustomizer,
  PlaceholderContent,
  PlaceholderName,
} from "@microsoft/sp-application-base";
import { SPEventArgs } from "@microsoft/sp-core-library";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { BackToTop } from "./BackToTop/BackToTop";

export interface ISpfxBackToTopApplicationCustomizerProperties {}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class SpfxBackToTopApplicationCustomizer extends BaseApplicationCustomizer<ISpfxBackToTopApplicationCustomizerProperties> {
  private topPlaceholder: PlaceholderContent | undefined;

  private renderPlaceHolders(): void {
    if (!this.topPlaceholder) {
      this.topPlaceholder = this.context.placeholderProvider.tryCreateContent(
        PlaceholderName.Top
      );
      this._renderControls();
    }
  }

  private _renderControls = () => {
    let retry = 0;
    var checkExist = setInterval(() => {
      let scrollContainer = document.querySelector(
        '[data-automation-id="contentScrollRegion"]'
      );

      if (scrollContainer) {
        if (this.topPlaceholder) {
          if (this.topPlaceholder.domElement) {
            const element = React.createElement(BackToTop, {
              currentUrl: window.location.href,
              scrollContainer,
              context: this.context,
            });
            ReactDOM.render(element, this.topPlaceholder.domElement);
          }
        } else {
          this.renderPlaceHolders();
          retry++;
        }
        clearInterval(checkExist);
      } else {
        if (retry > 10) {
          clearInterval(checkExist);
        }
      }
    }, 100);
  };

  @override
  public onDispose(): Promise<void> {
    this.context.placeholderProvider.changedEvent.remove(
      this,
      this.renderPlaceHolders
    );
    return Promise.resolve();
  }

  private navigatedEventHandler(args: SPEventArgs): void {
    this._renderControls();
  }

  @override
  public onInit(): Promise<void> {
    this.context.placeholderProvider.changedEvent.add(
      this,
      this.renderPlaceHolders
    );
    this.context.application.navigatedEvent.add(
      this,
      this.navigatedEventHandler
    );
    return Promise.resolve();
  }
}
