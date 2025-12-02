import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { boardMutations } from '@apis/board/board-mutations';
import { modal } from '@libs/modal';
import { toast } from '@libs/toast';
import type { ReviewManage } from '@components/dropdown/constants/select-options';

export function useBoardManagement(boardId: string) {
  const navigate = useNavigate();
  const [isManageBottomSheetOpen, setIsManageBottomSheetOpen] = useState(false);
  const [selectedManageOption, setSelectedManageOption] = useState<ReviewManage | null>(null);
  const { mutate: deleteBoard } = useMutation(boardMutations.DELETE_BOARD(boardId));

  const openManageSheet = useCallback(() => {
    setIsManageBottomSheetOpen(true);
  }, []);

  const closeManageSheet = useCallback(() => {
    setIsManageBottomSheetOpen(false);
  }, []);

  const handleManageOptionChange = useCallback(
    async (option: string) => {
      setSelectedManageOption(option as ReviewManage);
      setIsManageBottomSheetOpen(false);

      if (option === 'modify') {
        navigate(`/board-create?id=${boardId}`);
      } else if (option === 'delete') {
        const confirmDelete = await modal.confirm({
          title: '정말 삭제하시겠습니까?',
          confirmText: '확인',
          cancelText: '취소',
        });

        if (confirmDelete.ok) {
          deleteBoard(undefined, {
            onSuccess: () => {
              toast.success('게시글이 삭제되었습니다');
              navigate('/board');
            },
            onError: () => {
              toast.error('게시글 삭제에 실패했습니다');
            },
          });
        }
      }
    },
    [boardId, navigate, deleteBoard]
  );

  return {
    isManageBottomSheetOpen,
    selectedManageOption,
    openManageSheet,
    closeManageSheet,
    handleManageOptionChange,
  };
}
