// Default React App from create-react-app command.
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// Add Froala 3 Editor.
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import FroalaEditorComponent from 'react-froala-wysiwyg'; // eslint-disable-line no-unused-vars
import 'froala-editor/js/plugins.pkgd.min';

// Add jquery.
import $ from 'jquery';

// Load the file that contains common imports between demos. (functions, styles, etc)
import * as Generic from 'resources/demos/imports';

// Import the wiris plugin version.
import { version as pluginVersion } from '@wiris/mathtype-froala/package.json';
import reportWebVitals from './reportWebVitals';

// This needs to be included before the '@wiris/mathtype-froala' is loaded synchronously.
window.$ = $;
window.FroalaEditor = require('froala-editor');

// Load scripts synchronously.
require('@wiris/mathtype-froala');

// Apply specific demo names to all the objects.
document.getElementById('header_title_name').innerHTML = 'MathType for Froala on React';
document.getElementById('version_editor').innerHTML = 'Froala: ';

// // Set the initial content.
const content = Generic.editorContentImg;

// Copy the editor content before initializing it.
// Currently disabled by decision of QA.
// document.getElementById('transform_content').innerHTML = content;

// Add listener on click button to launch updateFunction.
document.getElementById('btn_update').addEventListener('click', (e) => {
  e.preventDefault();
  Generic.updateContent(FroalaEditor.INSTANCES[0].html.get(), 'transform_content');                     //eslint-disable-line
});

// Initialize editor.
// Define the toolbar & configuration options for the froala editor.
const toolbar = ['undo', 'redo', 'bold', 'italic', '|', 'wirisEditor', 'wirisChemistry', 'insertImage'];
const froalaConfig = {
  toolbarButtons: toolbar,
  // Add [MW] buttons to the image editing popup Toolbar.
  imageEditButtons: ['wirisEditor', 'wirisChemistry', 'imageDisplay', 'imageAlign', 'imageInfo', 'imageRemove'],

  key: process.env.REACT_APP_FROALA_API_KEY || '',

  // Allow all the tags to understand the mathml
  htmlAllowedTags: ['.*'],
  htmlAllowedAttrs: ['.*'],

  // List of tags that are not removed when they have no content inside
  // so that formulas renderize propertly
  htmlAllowedEmptyTags: ['mprescripts', 'none'],

  // Remove "Powered by Froala" water mark
  attribution: false,

  // Froala editor language
  // language: 'de',
  // You could set a different language for MathType editor:
  // mathTypeParameters: {
  //   editorParameters: { language: 'es' },
  // },

  // Execute on initialized editor.
  events: {
    initialized() {
      // Get and set the editor and wiris versions in this order.
      Generic.setEditorAndWirisVersion(FroalaEditor.VERSION, pluginVersion);        //eslint-disable-line
      // Since Froala 3.1.1 version, initialization events need to be called manually for the React component.
      // Parse the initial content set on the editor through html to render it
      const contentRendered = WirisPlugin.Parser.initParse(this.html.get(true));
      // this.html.set(contentRendered);

      // Set initial content
      this.html.set(content);
    },
  },
};

/* Create a component to be rendered later.
 This is important to remove complexity from the reactDom.render
 and to be able to add other functionality. */
// eslint-disable-next-line no-unused-vars
class Editor extends React.Component {
  // eslint-disable-next-line class-methods-use-this
  render() {
    return (
      <FroalaEditorComponent config={ froalaConfig } model={ content } />
    );
  }
}

// Render our components on page.
ReactDOM.render(<Editor />, document.getElementById('editor'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
reportWebVitals();
