import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TagList from '../components/TagList';
import * as actions from '../actions';
import * as api from '../api';

export class TagListContainer extends React.Component {

  render() {
    const { currentTag, selectPostsByTag, tags } = this.props;

    return (
      <TagList
        currentTag={currentTag}
        tags={tags}
        onSelect={tag => selectPostsByTag(tag)}
      />
    );
  }
}

TagListContainer.propTypes = {
  currentTag: PropTypes.string,
  selectPostsByTag: PropTypes.func.isRequired,
  tags: PropTypes.arrayOf(PropTypes.string)
};

TagListContainer.defaultProps = {
  tags: [],
};

const mapStateToProps = state => ({
  // TODO: use selectors
  tags: state.tags.tags,
  currentTag: state.posts.posts.tag
});

export const mapDispatchToProps = dispatch => ({
  createTag(tag) {
    return api.createTag(tag);
  },
  removeTag(postId, tag) {
    dispatch(actions.removeTag(postId, tag.id));
  },
  fetchTags() {
    dispatch(actions.fetchTags());
  },
  fetchPosts() {
    dispatch(actions.fetchPosts());
  },
  selectPostsByTag(tag) {
    dispatch(actions.selectPostsByTag(tag));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TagListContainer);
