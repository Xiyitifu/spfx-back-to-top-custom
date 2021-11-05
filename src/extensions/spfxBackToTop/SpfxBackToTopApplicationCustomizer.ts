import * as React from "react";
import * as ReactDOM from "react-dom";

import { override } from "@microsoft/decorators";
import {
  BaseApplicationCustomizer,
  PlaceholderContent,
  PlaceholderName,
} from "@microsoft/sp-application-base";
import IBackToTopProps from "./BackToTop/IBackToTopProps";

import * as strings from "SpfxBackToTopApplicationCustomizerStrings";
import BackToTop from "./BackToTop/BackToTop";
import { SPEventArgs } from "@microsoft/sp-core-library";

export interface ISpfxBackToTopApplicationCustomizerProperties {}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class SpfxBackToTopApplicationCustomizer extends BaseApplicationCustomizer<ISpfxBackToTopApplicationCustomizerProperties> {
  private topPlaceholder: PlaceholderContent | undefined;

  private renderPlaceHolders(): void {
    if (!this.topPlaceholder) {
      this.topPlaceholder = this.context.placeholderProvider.tryCreateContent(
        PlaceholderName.Top
      );
      this._renderControls(0);
    }
  }

  private _renderControls = (delay: number) => {
    var checkExist = setInterval(function () {
      let scrollContainer = document.querySelector(
        '[data-automation-id="contentScrollRegion"]'
      );

      if (scrollContainer) {
        if (this.topPlaceholder && this.topPlaceholder.domElement) {
          const element: React.ReactElement<IBackToTopProps> =
            React.createElement(BackToTop, {
              currentUrl: window.location.href,
              scrollContainer,
            });
          ReactDOM.render(element, this.topPlaceholder.domElement);
        } else {
          this.renderPlaceHolders();
        }
        clearInterval(checkExist);
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
    this._renderControls(3000);
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
