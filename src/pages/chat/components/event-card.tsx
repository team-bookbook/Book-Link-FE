import { cn } from '@libs/cn';
import { EVENT_IMAGES, EVENT_MESSAGES, STATUS_IMAGES } from '../constants/event-card-constants';

type BorrowEvent = 'checkout' | 'checkin' | 'renew';
type MessageKind = 'mine' | 'other';
type CardStatus = 'request' | 'success' | 'fail';

type Props = {
  type: BorrowEvent;
  kind: MessageKind;
  status?: CardStatus;
  userName?: string;
  onAccept?: () => void;
  onReject?: () => void;
};

export default function EventCard({ type, kind, status = 'request', userName = '고양이', onAccept, onReject }: Props) {
  const message = EVENT_MESSAGES[type][kind][status];
  const contentText = kind === 'other' ? `${userName} 님이 ${message.content}` : `${message.content}`;

  const cardRounded =
    kind === 'mine'
      ? 'rounded-tl-[20px] rounded-br-[20px] rounded-bl-[20px]'
      : 'rounded-tr-[20px] rounded-br-[20px] rounded-bl-[20px]';

  const topRounded = kind === 'mine' ? 'rounded-tl-[20px]' : 'rounded-tr-[20px]';

  const bgColor = status === 'fail' ? 'bg-system-error-15' : 'bg-system-success-15';
  const eventImage =
    status === 'success' ? STATUS_IMAGES.success : status === 'fail' ? STATUS_IMAGES.fail : EVENT_IMAGES[type];

  const showButtons = status === 'request' && kind === 'other';

  return (
    <div className={cn('min-h-[21rem] max-w-[24rem] min-w-[24rem] flex-col gap-[1rem]', cardRounded)}>
      <div className={cn('relative flex min-h-[9rem] flex-1 p-[1.6rem]', topRounded, bgColor)}>
        <h1 className='caption1'>{message.header}</h1>
        <img src={eventImage} className='absolute top-0 right-[10px] max-h-[10.7rem] max-w-[10.7rem]'></img>
      </div>
      <div className='flex-1 flex-col justify-between gap-[1rem] rounded-br-[20px] rounded-bl-[20px] bg-white px-[1.6rem] pt-[1.6rem] pb-[1.6rem]'>
        <h2 className='caption3'>{contentText}</h2>
        {showButtons ? (
          <div className='flex w-full gap-[8px]'>
            <button
              className='button4 bg-system-success-15 text-system-success flex-1 cursor-pointer rounded-[8px] py-[8px]'
              onClick={onAccept}
            >
              수락
            </button>
            <button
              className='button4 bg-system-error-15 text-system-error flex-1 cursor-pointer rounded-[8px] py-[8px]'
              onClick={onReject}
            >
              거절
            </button>
          </div>
        ) : (
          <div className='h-[3.2rem]'></div>
        )}
      </div>
    </div>
  );
}
