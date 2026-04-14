/* eslint-disable no-unused-vars */
import React, {useEffect, useRef, useState} from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import styled from "styled-components";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import DOMPurify from "dompurify";
import PropTypes from "prop-types";

import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";

import * as global from "../globalDefinitions/globalConstants";

import {globalThemePublic} from "../globalDefinitions/globalStyles";

const EditorWrapper = styled.div`
    position: relative;
    width: ${({windowWidth}) => windowWidth};
`;

export function SetQuillEditorContent(quillEditorRef, newContent) {
    const length = quillEditorRef.current.getLength();
    quillEditorRef.current.editor.deleteText(0, length);
    const sanitizedHtml = DOMPurify.sanitize(newContent);
    quillEditorRef.current.clipboard.dangerouslyPasteHTML(0, sanitizedHtml);
    quillEditorRef.current.focus();
}

export const QuillEditor = React.forwardRef(
    (
        {
            initialContent,
            error,
            setValue,
            reference,
            setDoNotSubmit,
            setDoNotValidate,
            characterLimit,
            quillEditorWidthLimit,
        },
        ref
    ) => {
        const [showEmojiPicker, setShowEmojiPicker] = useState(false);
        const myEditor = useRef(null);
        const defaultColor = "#EFEDFB";
        const [emojiData, setEmojiData] = useState(null);

        const [forbiddenCharsError] = useState(false);

        useEffect(() => {
            setTimeout(() => {
                setEmojiData(data); // Load emoji data asynchronously
            }, 2000);
        }, []);

        useEffect(() => {
            const updateEditorContent = () => {
                const sanitizedHtml = DOMPurify.sanitize(
                    myEditor.current.root.innerHTML
                );
                setValue("quillEditor", sanitizedHtml);
            };

            if (!myEditor.current) {
                const editor = new Quill("#editor", {
                    theme: "snow",
                    modules: {
                        toolbar: {
                            container: "#toolbar",
                        },
                        history: {
                            delay: 1500,
                            maxStack: 500,
                            userOnly: false,
                        },
                    },
                });

                myEditor.current = editor;
                reference.current = editor;
                const sanitizedHtml = DOMPurify.sanitize(initialContent);
                myEditor.current.clipboard.dangerouslyPasteHTML(
                    0,
                    sanitizedHtml
                );
                setValue("quillEditor", sanitizedHtml);

                const length = myEditor.current.getLength();
                myEditor.current.setSelection(length, 0);

                const editorContent = document.querySelector(".ql-editor");
                if (editorContent) {
                    editorContent.style.fontFamily =
                        globalThemePublic.fontFamily;
                    editorContent.style.color = globalThemePublic.textColor;
                    editorContent.style.fontSize = globalThemePublic.fontSize;
                    editorContent.style.backgroundColor = "black";
                }

                const events = [
                    "text-change",
                    "selection-change",
                    "editor-change",
                ];

                events.forEach((event) => {
                    // eslint-disable-next-line no-unused-vars
                    myEditor.current.on(event, (delta, oldDelta, source) => {
                        if (event === "text-change") {
                            const text = myEditor.current.getText();
                            if (text.length > characterLimit + 1) {
                                myEditor.current.deleteText(
                                    characterLimit,
                                    text.length
                                );
                            }
                        }
                        updateEditorContent();
                    });
                });

                myEditor.current.focus();
            }

            return () => {
                const events = [
                    "text-change",
                    "selection-change",
                    "editor-change",
                ];
                events.forEach((event) => {
                    myEditor.current.off(event, updateEditorContent);
                });
            };
        }, [characterLimit, initialContent, reference, setValue]);

        const handleEmojiSelect = (emoji) => {
            myEditor.current.focus();
            const selection = myEditor.current.getSelection();
            const currentFormat = myEditor.current.getFormat(selection);

            if (selection) {
                myEditor.current.clipboard.dangerouslyPasteHTML(
                    selection.index,
                    emoji.native
                );
                const insertedLength = emoji.native.length;

                myEditor.current.setSelection(
                    selection.index + insertedLength,
                    0,
                    Quill.sources.SILENT
                );

                if (currentFormat) {
                    myEditor.current.formatText(
                        selection.index,
                        insertedLength,
                        currentFormat,
                        Quill.sources.SILENT
                    );
                }
            } else {
                alert("Selection is null!!!");
            }

            myEditor.current.focus();
        };

        function handleUndo() {
            setDoNotSubmit(true);
            myEditor.current?.history.undo();
            myEditor.current?.focus();
        }

        function handleRedo() {
            setDoNotSubmit(true);
            myEditor.current?.history.redo();
            myEditor.current?.focus();
        }

        const handleEmojiButtonClick = () => {
            setDoNotSubmit(true);
            myEditor.current.focus();
            setShowEmojiPicker(!showEmojiPicker);
        };

        useEffect(() => {
            if (error) {
                myEditor.current.focus();
            }
        }, [error]);

        return (
            <div>
                <EditorWrapper
                    windowWidth={"100%"}
                    maxWidth={quillEditorWidthLimit}
                >
                    <div id="toolbar" style={{border: "none"}}>
                        <button className="ql-bold"></button>
                        <button className="ql-italic"></button>
                        <button className="ql-underline"></button>
                        <button className="ql-strike"></button>
                        <select
                            className="ql-color"
                            onChange={(e) =>
                                myEditor.current?.format(
                                    "color",
                                    e.target.value
                                )
                            }
                        >
                            <option value={defaultColor}></option>
                            <option value="#FCFB03"></option>
                            <option value="orange"></option>
                            <option value="#FF0000"></option>
                            <option value="#1FFF00"></option>
                            <option value="#00FFFF"></option>
                            <option value="#0700FF"></option>
                        </select>

                        <button
                            title="Insert Emoji"
                            onClick={handleEmojiButtonClick}
                            style={{marginTop: "-2px"}}
                        >
                            😊
                        </button>
                        <button className="ql-list" value="ordered"></button>
                        <button className="ql-list" value="bullet"></button>
                        <button onClick={handleUndo}>
                            <UndoIcon />
                        </button>
                        <button onClick={handleRedo}>
                            <RedoIcon />
                        </button>
                    </div>
                    <div
                        id="editor"
                        style={{
                            height: "360px",
                            width: "92%",
                            maxWidth: quillEditorWidthLimit,
                            overflowY: "hidden",
                            overflow: "hidden",
                        }}
                    />
                    <div>
                        <div>
                            {forbiddenCharsError && (
                                <div
                                    style={{
                                        color: "red",
                                        fontSize: "12px",
                                    }}
                                >
                                    {global.pleaseAvoidSomeSpecialChars}
                                </div>
                            )}
                        </div>

                        <div style={{marginTop: "5px"}}>
                            {showEmojiPicker && (
                                <Picker
                                    data={emojiData}
                                    onEmojiSelect={handleEmojiSelect}
                                    theme="dark"
                                    searchPosition="none"
                                    emojiButtonSize="38"
                                    perLine="7"
                                    locale="es"
                                />
                            )}
                        </div>
                    </div>
                </EditorWrapper>
            </div>
        );
    }
);

QuillEditor.displayName = "QuillEditor";

QuillEditor.propTypes = {
    initialContent: PropTypes.string.isRequired,
    error: PropTypes.bool,
    setValue: PropTypes.func.isRequired,
    setDoNotValidate: PropTypes.func.isRequired,
    reference: PropTypes.object.isRequired,
    setDoNotSubmit: PropTypes.func.isRequired,
    characterLimit: PropTypes.number.isRequired,
    quillEditorWidthLimit: PropTypes.string,
};
