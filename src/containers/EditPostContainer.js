import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { IconButton, MenuItem, Toolbar, withStyles } from 'material-ui';
import { Edit, Slideshow } from 'material-ui-icons';
import {
  getIsFetchingBlock,
  getIsUpdatingPost,
  getPostErrorMessage,
  getSelectedPost,
} from '../reducers';
import withDragDropContext from '../common/withDragDropContext';
import { fetchFile } from '../api/dropbox';
import Editor from '../components/Editor';
import RenderedView from '../components/RenderedView';
import { center } from '../common/styles';

const styles = {
  center
};

const NoPosts = withStyles(styles)(({ classes }) => (
  <div className={classes.center}>
    No post available
  </div>
));

export class EditPostContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      post: props.post,
      showRenderedView: false,
    };
    this.handleUpdatePost = this.handleUpdatePost.bind(this);
    this.handleClickOpenEditor = this.handleClickOpenEditor.bind(this);
    this.handleClickOpenRenderedView = this.handleClickOpenRenderedView.bind(this);
    this.handleClickOpenBoth = this.handleClickOpenBoth.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.post !== this.props.post && this.props.post !== undefined) {
      this.setState(
        { isLoading: true },
        () =>
          fetchFile(this.props.post.path_lower)
            .then((fileContent) => {
              this.setState({
                text: fileContent,
                isLoading: false
              });
            })
      );
    }
  }

  handleClickOpenEditor() {
    this.setState({
      showEditor: true,
      showRenderedView: false,
      showBoth: false,
    });
  }

  handleClickOpenRenderedView() {
    this.setState({
      showEditor: false,
      showRenderedView: true,
      showBoth: false,
    });
  }

  handleClickOpenBoth() {
    this.setState({
      showEditor: false,
      showRenderedView: false,
      showBoth: true,
    });
  }

  handleUpdatePost(post) {
    this.setState({ post });
  }

  render() {
    const { post } = this.props;
    const { isLoading, showRenderedView, text } = this.state;

    if (isLoading) {
      return (<div>Loading...</div>);
    }

    if (post === undefined) {
      return <NoPosts />;
    }

    const ToolBar = () => (
      <Toolbar style={{ paddingLeft: 0 }}>
        <MenuItem onClick={() => this.setState({ showRenderedView: false })}>
          <IconButton>
            <Edit />
          </IconButton>
        </MenuItem>
        <MenuItem onClick={() => this.setState({ showRenderedView: true })}>
          <IconButton>
            <Slideshow />
          </IconButton>
        </MenuItem>
      </Toolbar>
    );

    if (showRenderedView) {
      return (
        <React.Fragment>
          <ToolBar />
          <RenderedView
            text={text}
          />
        </React.Fragment>
      );
    }
    return (
      <React.Fragment>
        <ToolBar />
        <Editor
          post={post}
          text={text}
        />
      </React.Fragment>
    );
  }
}


EditPostContainer.propTypes = {
  post: PropTypes.object,
};

EditPostContainer.defaultProps = {
  post: undefined,
};

export const mapStateToProps = state => ({
  post: getSelectedPost(state),
  userId: state.auth.userId,
  isFetchingBlock: getIsFetchingBlock(state),
  isUpdatingPost: getIsUpdatingPost(state),
  errorMessage: getPostErrorMessage(state),
});

export default connect(
  mapStateToProps,
  null,
)(withDragDropContext(EditPostContainer));
