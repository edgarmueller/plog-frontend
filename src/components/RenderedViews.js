import React from 'react';
import PropTypes from 'prop-types';
import RenderedViewContainer from '../containers/RenderedViewContainer';

const RenderedViews = ({ post, isFetchingBlock, focusedBlockId }) => (
  <div>
    {
      post.blocks.map(block =>
        (
          <RenderedViewContainer
            key={block.id || block.tempid}
            postId={post.id}
            isFetchingBlock={isFetchingBlock}
            block={block}
            isFocused={
              (block.id === focusedBlockId || block.tempid === focusedBlockId)
              && focusedBlockId !== undefined
            }
          />
        ),
      )
    }
  </div>
);

RenderedViews.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.number,
    blocks: PropTypes.arrayOf(
      PropTypes.shape({
        dialect: PropTypes.string.isRequired,
        text: PropTypes.string,
      }),
    ),
  }).isRequired,
  isFetchingBlock: PropTypes.bool.isRequired,
  focusedBlockId: PropTypes.string,
};

RenderedViews.defaultProps = {
  focusedBlockId: undefined,
};

export default RenderedView;