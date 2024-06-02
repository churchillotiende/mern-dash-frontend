export function Table(props) {
  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto sm:-mx-6 lg:-mx-8 horiz">
        <div className="inline-block py-2 min-w-full sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-lg">
            <table className="rounded-lg min-w-full">{props.children}</table>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Thead(props) {
  return <thead className="bg-gray-50">{props.children}</thead>;
}

export function Trow(props) {
  return (
    <tr className="border-b border-info border-opacity-40 bg-white even:bg-info even:bg-opacity-10 even:text-dark hover:bg-opacity-75 odd:hover:bg-info tr-eo">
      {props.children}
    </tr>
  );
}
