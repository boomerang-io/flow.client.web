import React, { Component, Fragment } from "react";
import Button from "@boomerang/boomerang-components/lib/Button";
import ModalContentBody from "@boomerang/boomerang-components/lib/ModalContentBody";
import ModalContentHeader from "@boomerang/boomerang-components/lib/ModalContentHeader";
import ModalContentFooter from "@boomerang/boomerang-components/lib/ModalContentFooter";
import ModalConfirmButton from "@boomerang/boomerang-components/lib/ModalConfirmButton";
import ModalNavButton from "@boomerang/boomerang-components/lib/ModalNavButton";
import TextInput from "@boomerang/boomerang-components/lib/TextInput";
import cronstrue from "cronstrue";
import assert from "assert";
import "./styles.scss";

export class CronJobContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { showInterpretation: false };
  }

  OnClick = () => {
    let cronstrueOutput;
    try {
      cronstrueOutput = cronstrue.toString(this.state.cronString);
    } catch (e) {
      console.log("we are in catch");
      cronstrueOutput = e.message;
    }
    console.log(cronstrueOutput);
    this.setState({ showInterpretation: true, interpretation: cronstrueOutput });
  };

  OnSave = () => {
    this.props.handleOnChange(this.state.cronString, {}, "cronString");
    this.props.closeModal();
  };

  render() {
    console.log(this.props);
    return (
      <Fragment>
        <ModalContentHeader title="Cron Scheduling" subtitle="" />
        <ModalContentBody>
          <div>
            <TextInput
              value={this.state.cron || ""}
              title="Cron"
              placeholder="Enter a Cron Expression"
              name="cron"
              theme="bmrg-white"
              onChange={val => this.setState({ cronString: val })}
            />
          </div>
          <Button
            theme="bmrg-black"
            onClick={() =>
              this.setState({ showInterpretation: true, interpretation: cronstrue.toString(this.state.cronString) })
            }
          >
            Check
          </Button>
          {this.state.showInterpretation && <p className="cronInterpretation"> {this.state.interpretation}</p>}
        </ModalContentBody>
        <ModalContentFooter>
          <ModalConfirmButton onClick={this.OnSave} text="SAVE" confirmModalProps={this.confirmModalProps} />
        </ModalContentFooter>
      </Fragment>
    );
  }
}
