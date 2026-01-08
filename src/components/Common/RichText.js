import React, { useRef } from 'react';
import { Editor,  RichUtils } from 'draft-js';

const RichTextEditor= (props) => {
    const editorRef = useRef()
  const onChange = editorState => {
    props.onChange('editorState', editorState);
    // console.log(editorState.getCurrentContent())
  };

  const focus = () => editorRef.current.focus();

  const handleKeyCommand = command => {
    const { editorState } = props;
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      onChange(newState);
      return true;
    }
    return false;
  };

  const onTab = e => {
    const maxDepth = 4;
    onChange(RichUtils.onTab(e, props.editorState, maxDepth));
  };
  
  const toggleBlockType = blockType => {
    onChange(RichUtils.toggleBlockType(props.editorState, blockType));
  };
  
  const toggleInlineStyle = inlineStyle => {
    onChange(
      RichUtils.toggleInlineStyle(props.editorState, inlineStyle)
    );
  };
  
    const { editorState } = props;
    // If the user changes block type before entering any text, we can
    // either style the placeholder or hide it. Let's just hide it now.
    let className = 'RichEditor-editor';
    var contentState = editorState.getCurrentContent();
    if (!contentState.hasText()) {
      if (contentState.getBlockMap().first().getType() !== 'unstyled') {
        className += ' RichEditor-hidePlaceholder';
      }
    }
    return (
      <div className="RichEditor-root">
          <div>
          <InlineStyleControls
          editorState={editorState}
          onToggle={toggleInlineStyle}
        />
        <BlockStyleControls
          editorState={editorState}
          onToggle={toggleBlockType}
        />
       
        </div>
        <div className={className} onClick={focus}>
          <Editor
            blockStyleFn={getBlockStyle}
            customStyleMap={styleMap}
            editorState={editorState}
            handleKeyCommand={handleKeyCommand}
            onChange={onChange}
            onTab={onTab}
            placeholder="Tell a story..."
            ref={editorRef}
            spellCheck={true}
          />
        </div>
      </div>
    );
}


// Custom overrides for "code" style.
const styleMap = {
  CODE: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
    fontSize: 16,
    padding: 2,
  },
};
function getBlockStyle(block) {
  switch (block.getType()) {
    case 'blockquote':
      return 'RichEditor-blockquote';
    default:
      return null;
  }
}

const StyleButton = (props) => {
  
    const onToggle = e => {
      e.preventDefault();
      props.onToggle(props.style);
    }
    
  
    let className = 'RichEditor-styleButton';
    if (props.active) {
      className += ' RichEditor-activeButton';
    }
    return (
      <span className={className} onMouseDown={onToggle}>
        {props.label}
      </span>
    );
}
const BLOCK_TYPES = [
//   { label: 'H1', style: 'header-one' },
//   { label: 'H2', style: 'header-two' },
  { label: 'H3', style: 'header-three' },
  { label: 'H4', style: 'header-four' },
  { label: 'H5', style: 'header-five' },
//   { label: 'H6', style: 'header-six' },
  { label: 'Blockquote', style: 'blockquote' },
  { label: 'UL', style: 'unordered-list-item' },
  { label: 'OL', style: 'ordered-list-item' },
//   { label: 'Code Block', style: 'code-block' },
];
const BlockStyleControls = props => {
  const { editorState } = props;
  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();
  return (
    <span className="RichEditor-controls">
      {BLOCK_TYPES.map(type =>
        <StyleButton
          key={type.label}
          active={type.style === blockType}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      )}
    </span>
  );
};
var INLINE_STYLES = [
  { label: 'Bold', style: 'BOLD' },
  { label: 'Italic', style: 'ITALIC' },
  { label: 'Underline', style: 'UNDERLINE' },
//   { label: 'Monospace', style: 'CODE' },
];
const InlineStyleControls = props => {
  var currentStyle = props.editorState.getCurrentInlineStyle();
  return (
    <span className="RichEditor-controls">
      {INLINE_STYLES.map(type =>
        <StyleButton
          key={type.label}
          active={currentStyle.has(type.style)}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      )}
    </span>
  );
};

export default RichTextEditor;