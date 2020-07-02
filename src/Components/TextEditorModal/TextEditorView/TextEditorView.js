/* eslint-disable no-template-curly-in-string */
import React, { useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Controlled as CodeMirrorReact } from "react-codemirror2";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/shell/shell";
import "codemirror/mode/yaml/yaml";
import "codemirror/addon/hint/show-hint";
import "codemirror/addon/hint/javascript-hint";
import "codemirror/addon/search/searchcursor";
import "codemirror/addon/fold/foldgutter.css";
import "codemirror/addon/fold/foldcode.js";
import "codemirror/addon/fold/foldgutter.js";
import "codemirror/addon/fold/brace-fold.js";
import "codemirror/addon/fold/indent-fold.js";
import "codemirror/addon/fold/comment-fold.js";
import "codemirror/addon/comment/comment.js";
import { Undo20, Redo20, Copy20, Cut20, Paste20, ArrowUp16, ArrowDown16 } from "@carbon/icons-react";
import {
  ModalBody,
  ModalFooter,
  Toolbar,
  ToolbarItem,
  Search,
  Dropdown,
  Button,
} from "@boomerang-io/carbon-addons-boomerang-react";
import CodeMirror from "codemirror";
import "./styles.scss";

TextEditorView.propTypes = {
  item: PropTypes.shape({
    name: PropTypes.string,
  }),
  setTextAreaValue: PropTypes.func.isRequired,
  setShouldConfirmModalClose: PropTypes.func,
  value: PropTypes.string,
};

const escapeRegExp = (val) => {
  return val && val.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const languages = [
  {
    id: "javascript",
    text: "JavaScript/JSON",
    params: { hint: CodeMirror.hint.javascript, mode: { name: "javascript" } },
  },
  { id: "shell", text: "Shell", params: { mode: "shell" } },
  { id: "text", text: "Text", params: { mode: "text/plain" } },
  { id: "yaml", text: "YAML", params: { mode: "yaml" } },
];

function TextEditorView(props) {
  const [value, setValue] = useState(props.value);
  const editor = useRef(null);
  const [doc, setDoc] = useState();
  const [searchText, setSearchText] = useState("");
  const [clipboard, setClipboard] = useState("");
  const [languageParams, setLanguageParams] = useState(
    props.language
      ? languages.find((value) => value.id === props.language).params
      : { id: "text", text: "Text", params: { mode: "text/plain" } }
  );

  useEffect(() => {
    const autoSuggestions =
      props.autoSuggestions?.map((elm) => {
        return { text: elm.value, displayText: elm.label };
      }) ?? [];

    CodeMirror.registerHelper("hint", "dictionaryHint", function (editor) {
      const cur = editor.getCursor();
      const curLine = editor.getLine(cur.line);
      let start = cur.ch;
      let end = start;
      while (end < curLine.length && /[\w${:]/.test(curLine.charAt(end))) ++end;
      while (start && /[\w${:]/.test(curLine.charAt(start - 1))) --start;
      const curWord = start !== end && curLine.slice(start, end);
      const regex = new RegExp("^" + escapeRegExp(curWord), "i");
      return {
        list: (!curWord
          ? []
          : autoSuggestions.filter(
              (item) => (curWord.startsWith("${p:") && item.text.match(regex)) || item.displayText.match(regex)
            )
        ).sort(),
        from: CodeMirror.Pos(cur.line, start),
        to: CodeMirror.Pos(cur.line, end),
      };
    });
  }, [props.autoSuggestions]);

  const saveValue = () => {
    props.setShouldConfirmModalClose(false);
    props.setTextAreaValue(value);
    props.formikSetFieldValue(value);
    props.forceCloseModal();
  };

  const undo = () => {
    doc.undo();
  };

  const redo = () => {
    doc.redo();
  };

  const cut = () => {
    setClipboard(doc.getSelection());
    doc.replaceSelection("");
  };

  const copy = () => {
    setClipboard(doc.getSelection());
  };

  const paste = () => {
    doc.replaceSelection(clipboard);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      findNext();
    }
  };

  const handleSearchText = (e) => {
    const { value } = e.target;
    setSearchText(value);
  };

  const findNext = () => {
    const cursor = doc.getSearchCursor(searchText, doc.getCursor());
    if (cursor.findNext()) {
      doc.setCursor(cursor.to());
      doc.setSelection(cursor.from(), cursor.to());
    }
    editor.current.focus();
  };

  const findPrevious = () => {
    const cursor = doc.getSearchCursor(searchText, doc.getCursor("start"));
    if (cursor.findPrevious()) {
      doc.setCursor(cursor.to());
      doc.setSelection(cursor.from(), cursor.to());
    }
    editor.current.focus();
  };

  const languageOptions = languages.map((language) => ({ id: language.id, text: language.text }));

  const onChangeLanguage = (language) => {
    setLanguageParams(languages.find((value) => value.id === language.selectedItem.id).params);
  };

  // const commentCode = () => {
  //   editor.current.toggleComment();
  // };

  //TB trying to get autocomplete to work
  const autoComplete = (cm) => {
    CodeMirror.showHint(cm, CodeMirror.hint.dictionaryHint, { completeSingle: false });
  };

  const foldCode = (cm) => {
    cm.foldCode(cm.getCursor());
  };

  const toggleComment = (cm) => {
    cm.toggleComment();
  };

  const blockComment = (cm) => {
    if (doc.somethingSelected()) {
      const selPosition = doc.listSelections();
      if (!cm.uncomment(selPosition[0].head, selPosition[0].anchor, { fullLines: false })) {
        cm.blockComment(selPosition[0].head, selPosition[0].anchor, { fullLines: false });
      }
    }
  };

  return (
    <>
      <ModalBody
        style={{
          maxWidth: "80rem",
          maxHeight: "42rem",
          height: "100%",
          width: "100%",
          margin: "auto",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          padding: "0 2rem",
        }}
      >
        <Toolbar className="b-task-text-area">
          <ToolbarItem>
            <Button
              size="small"
              kind="ghost"
              iconDescription="Undo"
              tooltipPosition="bottom"
              tooltipAlignment="end"
              hasIconOnly
              renderIcon={Undo20}
              onClick={undo}
              className="b-task-text-area__button"
            />
          </ToolbarItem>
          <ToolbarItem>
            <Button
              size="small"
              kind="ghost"
              iconDescription="Redo"
              tooltipPosition="bottom"
              tooltipAlignment="center"
              hasIconOnly
              renderIcon={Redo20}
              onClick={redo}
              className="b-task-text-area__button"
            />
          </ToolbarItem>
          <ToolbarItem>
            <Button
              size="small"
              kind="ghost"
              iconDescription="Copy"
              tooltipPosition="bottom"
              tooltipAlignment="center"
              hasIconOnly
              renderIcon={Copy20}
              onClick={copy}
              className="b-task-text-area__button"
            />
          </ToolbarItem>
          <ToolbarItem>
            <Button
              size="small"
              kind="ghost"
              iconDescription="Cut"
              tooltipPosition="bottom"
              tooltipAlignment="center"
              hasIconOnly
              renderIcon={Cut20}
              onClick={cut}
              className="b-task-text-area__button"
            />
          </ToolbarItem>
          <ToolbarItem>
            <Button
              size="small"
              kind="ghost"
              iconDescription="Paste"
              tooltipPosition="bottom"
              tooltipAlignment="center"
              hasIconOnly
              renderIcon={Paste20}
              onClick={paste}
              className="b-task-text-area__button"
            />
          </ToolbarItem>
          <ToolbarItem>
            <Search
              id="search"
              light={false}
              labelText="Search"
              closeButtonLabelText=""
              placeHolderText="Search"
              onChange={handleSearchText}
              onKeyPress={handleKeyPress}
              size="sm"
            />
          </ToolbarItem>
          <ToolbarItem>
            <Button
              size="small"
              kind="ghost"
              iconDescription="Find previous"
              tooltipPosition="bottom"
              tooltipAlignment="center"
              hasIconOnly
              renderIcon={ArrowUp16}
              onClick={findPrevious}
              className="b-task-text-area__button"
            />
          </ToolbarItem>
          <ToolbarItem>
            <Button
              size="small"
              kind="ghost"
              iconDescription="Find next"
              tooltipPosition="bottom"
              tooltipAlignment="center"
              hasIconOnly
              renderIcon={ArrowDown16}
              onClick={findNext}
              className="b-task-text-area__button"
            />
          </ToolbarItem>
          {/* <ToolbarItem>
            <Button
              size="small"
              kind="ghost"
              iconDescription="Comment"
              tooltipPosition="bottom"
              tooltipAlignment="center"
              hasIconOnly
              renderIcon={Chat20}
              onClick={commentCode}
              className="b-task-text-area__button"
            />
          </ToolbarItem> */}
          <ToolbarItem>
            <div className="b-task-text-area__language-dropdown">
              <Dropdown
                id="dropdown-language"
                type="default"
                label="Language selection"
                ariaLabel="Dropdown"
                light={false}
                initialSelectedItem={
                  props.language
                    ? languageOptions.find((languageOption) => languageOption.id === props.language)
                    : languageOptions[0]
                }
                items={languageOptions}
                itemToString={(item) => (item ? item.text : "")}
                onChange={onChangeLanguage}
              />
            </div>
          </ToolbarItem>
        </Toolbar>

        <CodeMirrorReact
          editorDidMount={(cmeditor) => {
            editor.current = cmeditor;
            setDoc(cmeditor.getDoc());
          }}
          value={value}
          options={{
            readOnly: props.readOnly,
            theme: "material",
            extraKeys: {
              "Ctrl-Space": "autocomplete",
              "Ctrl-Q": foldCode,
              "Cmd-/": toggleComment,
              "Shift-Alt-A": blockComment,
              "Shift-Opt-A": blockComment,
            },
            lineWrapping: true,
            foldGutter: true,
            lineNumbers: true,
            gutters: ["CodeMirrorReact-linenumbers", "CodeMirror-foldgutter"],
            ...languageParams,
          }}
          onBeforeChange={(editor, data, value) => {
            props.setShouldConfirmModalClose(true);
            setValue(value);
          }}
          //TB: trying to get autocomplete to work
          onKeyUp={(cm, event) => {
            if (
              !cm.state.completionActive /*Enables keyboard navigation in autocomplete list*/ &&
              event.keyCode !== 13
            ) {
              /*Enter - do not open autocomplete list just after item has been selected in it*/
              autoComplete(cm);
            }
          }}
        />
      </ModalBody>
      <ModalFooter>
        <Button onClick={saveValue}>Update</Button>
      </ModalFooter>
    </>
  );
}

export default TextEditorView;
