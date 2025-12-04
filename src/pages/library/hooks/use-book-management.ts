import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { libraryBookMutations } from '@apis/library/library-book-mutations';
import { modal } from '@libs/modal';
import { toast } from '@libs/toast';
import type { ReviewManage } from '@components/dropdown/constants/select-options';

export function useBookManagement(libraryBookId: string) {
  const navigate = useNavigate();
  const [isManageBottomSheetOpen, setIsManageBottomSheetOpen] = useState(false);
  const [selectedManageOption, setSelectedManageOption] = useState<ReviewManage | null>(null);
  const { mutate: deleteLibraryBook } = useMutation(libraryBookMutations.DELETE_LIBRARY_BOOK(libraryBookId));

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
        navigate(`/book-create?id=${libraryBookId}`);
      } else if (option === 'delete') {
        const confirmDelete = await modal.confirm({
          title: '정말 삭제하시겠습니까?',
          confirmText: '확인',
          cancelText: '취소',
        });

        if (confirmDelete.ok) {
          deleteLibraryBook(undefined, {
            onSuccess: () => {
              toast.success('도서가 삭제되었습니다');
              navigate('/library');
            },
            onError: () => {
              toast.error('도서 삭제에 실패했습니다');
            },
          });
        }
      }
    },
    [navigate, deleteLibraryBook, libraryBookId]
  );

  return {
    isManageBottomSheetOpen,
    selectedManageOption,
    openManageSheet,
    closeManageSheet,
    handleManageOptionChange,
  };
}
