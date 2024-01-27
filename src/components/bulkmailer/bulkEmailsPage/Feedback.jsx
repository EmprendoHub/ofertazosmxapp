import LinearWithValueLabel from '@/lib/linearProgress';

export default function Feedback({ emailListData, counter }) {
  return (
    <>
      <div className="text-blue-800 border-t pt-100">
        Se envió a {counter} contactos
        <LinearWithValueLabel
          progress={counter}
          totalNo={emailListData.length}
        />
      </div>
    </>
  );
}
