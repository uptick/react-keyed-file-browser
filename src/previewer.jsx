import React from 'react'
import JQuery from 'jquery'
import PDF from 'react-pdf'

import LoadingSpinner from './loading-spinner.jsx'

class Previewer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ...this.state,

      imageLoaded: false,
      pdfLoaded: false,
      pdfPage: 1,
      pdfPages: 0,

      loadedPreviews: {},
    };
  }

  componentDidMount() {
    this.loadPreview();
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.fileKey != this.props.fileKey)
      this.loadPreview();
  }
  loadPreview() {
    switch (this.props.extension) {
      case 'txt':
        JQuery.ajax({
          url: this.props.url,
          success: (response) => {
            this.setState(state => {
              state.loadedPreviews[this.props.fileKey] = response;
              return state;
            });
          },
        });
        break;
    }
  }

  handleImageLoaded(event) {
    this.setState(state => {
      state.imageLoaded = true;
      return state;
    });
  }
  handlePdfLoaded(pages) {
    this.setState(state => {
      state.pdfLoaded = true;
      state.pdfPage = 1;
      state.pdfPages = pages;
      return state;
    });
  }
  handleOpenFolderClick(event) {
    event.preventDefault();
    this.props.openFilePath(this.props.fileKey);
  }

  previousPreviewPdfPage() {
    this.setState(state => {
      state.pdfPage--;
      if (state.pdfPage <= 0)
        state.pdfPage = state.pdfPages;
      return state;
    }, this.fixPdfHack);
  }
  nextPreviewPdfPage() {
    this.setState(state => {
      state.pdfPage++;
      if (state.pdfPage > state.pdfPages)
        state.pdfPage = 1;
      return state;
    }, this.fixPdfHack);
  }

  fixPdfHack() {
    window.setTimeout(() => {
      this.forceUpdate();
    }, 200);
  }

  render() {
    var navigation;
    var contents;
    var fileLoadingSpinner = (
      <div style={{margin: '100px 0', textAlign: 'center'}}>
        <LoadingSpinner /> Loading ...
      </div>
    );
    switch (this.props.extension) {
      case 'jpeg':
      case 'jpg':
      case 'png':
      case 'svg':
      case 'gif':
        var spinner;
        var imageStyle = {
          maxWidth: '100%',
          display: 'block',
          margin: '0 auto',
        };
        if (!this.state.imageLoaded) {
          spinner = fileLoadingSpinner;
          imageStyle.height = '0px';
        }
        contents = (
          <div>
            <img
              src={this.props.url}
              style={imageStyle}
              onLoad={this.handleImageLoaded}
            />
            {spinner}
          </div>
        );
        break;

      case 'txt':
        if (this.props.fileKey in this.state.loadedPreviews) {
          contents = (
            <div style={{whiteSpace: 'pre'}}>
              {this.state.loadedPreviews[this.props.fileKey]}
            </div>
          );
        }
        else {
          contents = fileLoadingSpinner;
        }
        break;

      case 'pdf':
        if (this.state.pdfLoaded) {
          navigation = (
            <div className="pull-xs-left">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={this.previousPreviewPdfPage}
              >
                &lt;
              </button>
              &nbsp;Page {this.state.pdfPage} of {this.state.pdfPages}&nbsp;
              <button
                type="button"
                className="btn btn-secondary"
                onClick={this.nextPreviewPdfPage}
              >
                &gt;
              </button>
            </div>
          );
        }
        contents = (
          <div style={{display: 'block', textAlign: 'center'}}>
            <PDF
              ref="renderedPdf"
              file={this.props.url}
              page={this.state.pdfPage || 1}
              onDocumentComplete={this.handlePdfLoaded}
              loading={fileLoadingSpinner}
            />
          </div>
        );
        break;

      case 'doc':
      case 'docx':
      case 'xls':
      case 'xlsx':
      case 'ppt':
      case 'pptx':
        contents = (
          <div style={{
            paddingTop: '5rem',
            paddingBottom: '5rem',
            textAlign: 'center',
          }}>
            <a
              className="btn btn-primary btn-xl"
              href={`https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(this.props.url)}`}
              target="_blank"
            >
              <i className="fa fa-windows" aria-hidden="true"></i> View on Office Online
            </a>
          </div>
        );
        contents = (
          <iframe
            src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(this.props.url)}&wdStartOn=1&wdEmbedCode=0`}
            frameborder='0'
            style={{height: '60vh',}}
          >
            This is an embedded <a target='_blank' href='https://office.com'>Microsoft Office</a>
            document, powered by <a target='_blank' href='https://office.com/webapps'>Office
            Online</a>.
          </iframe>
        );
        break;

      default:
        contents = (
          <p>Unable to preview file of type "{this.props.extension}".</p>
        );
        break;
    }
    return (
      <div onClick={this.props.closePreview} ref="preview">
        <div
          className="modal fade in"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="gridModalLabel"
          aria-hidden="true"
          style={{display: 'block'}}
        >
          <div
            className="modal-dialog modal-lg"
            role="document"
          >
            <div
              className="modal-content"
              onClick={function(event) {
                event.stopPropagation();
              }}
            >
              <div className="modal-header">
                <button
                  type="button"
                  className="close"
                  aria-label="Close"
                  onClick={this.props.closePreview}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
                <h4 className="modal-title">{this.props.name}</h4>
                <span className="text-muted">{this.props.fileKey}</span>
              </div>
              <div className="modal-body" style={{maxHeight: '70vh', overflowY: 'scroll'}}>
                {contents}
              </div>
              <div className="modal-footer">
                {navigation}
                <a href="#" className="btn btn-secondary" onClick={this.handleOpenFolderClick}>
                  Open folder
                </a> <a
                  href={this.props.url}
                  className="btn btn-primary"
                  download="download"
                >
                  <i className="fa fa-download" aria-hidden="true"></i> Download
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-backdrop fade in"></div>
      </div>
    );
  }
}

export default Previewer
