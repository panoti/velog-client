import React from 'react';
import styled, { css } from 'styled-components';
import { Comment } from '../../lib/graphql/post';
import palette from '../../lib/styles/palette';
import { formatDate } from '../../lib/utils';
import Typography from '../common/Typography';
import { PlusBoxIcon, MinusBoxIcon } from '../../static/svg';
import { userThumbnail } from '../../static/images';
import useBoolean from '../../lib/hooks/useBoolean';
import PostRepliesContainer from '../../containers/post/PostRepliesContainer';

const PostCommentItemBlock = styled.div`
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
  & + & {
    border-top: 1px solid ${palette.gray2};
  }
`;
const CommentHead = styled.div`
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: space-between;
  .profile {
    display: flex;
    align-items: center;
    img {
      width: 3.375rem;
      height: 3.375rem;
      display: block;
      border-radius: 50%;
    }
    .comment-info {
      margin-left: 1rem;
      line-height: 1;
      .username {
        font-size: 1rem;
        font-weight: bold;
        color: ${palette.gray8};
      }
      .date {
        margin-top: 0.5rem;
        color: ${palette.gray6};
        font-size: 0.875rem;
      }
    }
  }
  .actions {
    font-size: 0.875rem;
    color: ${palette.gray6};
    span {
      cursor: pointer;
      &:hover {
        color: ${palette.gray5};
        text-decoration: underline;
      }
    }
    span + span {
      margin-left: 0.5rem;
    }
  }
`;

const CommentText = styled.p<{ deleted: boolean }>`
  ${props =>
    props.deleted &&
    css`
      color: ${palette.gray6};
      font-style: italic;
    `}
`;
const CommentFoot = styled.div`
  margin-top: 2rem;
`;
const TogglerBlock = styled.div`
  display: flex;
  align-items: center;
  color: ${palette.teal6};
  font-weight: bold;
  svg {
    margin-right: 0.5rem;
  }
  cursor: pointer;
  &:hover {
    color: ${palette.teal5};
  }
`;

export interface PostCommentItemProps {
  comment: Comment;
  ownComment: boolean;
}

interface TogglerProps {
  open: boolean;
  count: number;
  onToggle: () => any;
}

const Toggler: React.FC<TogglerProps> = ({ open, onToggle, count }) => {
  const openText = count ? `${count}개의 답글` : `답글 달기`;

  return (
    <TogglerBlock onClick={onToggle}>
      {open ? <MinusBoxIcon /> : <PlusBoxIcon />}
      <span>{open ? '숨기기' : openText}</span>
    </TogglerBlock>
  );
};

const PostCommentItem: React.FC<PostCommentItemProps> = ({
  comment,
  ownComment,
}) => {
  const { id, user, created_at, text, replies_count, deleted } = comment;
  const [open, onToggle] = useBoolean(false);

  return (
    <PostCommentItemBlock className="comment">
      <CommentHead>
        <div className="profile">
          <img
            src={(user && user.profile.thumbnail) || userThumbnail}
            alt="comment-user-thumbnail"
          />
          <div className="comment-info">
            <div className="username">
              {user ? user.username : '알 수 없음'}
            </div>
            <div className="date">{formatDate(created_at)}</div>
          </div>
        </div>
        {ownComment && (
          <div className="actions">
            <span>수정</span>
            <span>삭제</span>
          </div>
        )}
      </CommentHead>
      <Typography>
        <CommentText deleted={deleted}>
          {text || '삭제된 댓글입니다.'}
        </CommentText>
      </Typography>
      <CommentFoot>
        <Toggler open={open} onToggle={onToggle} count={replies_count} />
        {open && <PostRepliesContainer commentId={id} onHide={onToggle} />}
      </CommentFoot>
    </PostCommentItemBlock>
  );
};

export default React.memo(PostCommentItem);
