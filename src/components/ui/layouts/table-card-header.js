function TableCardHeader({ children, actions }) {
  return (
    <header className="flex flex-wrap justify-between items-end">
      <div className="flex w-full md:w-6/12 flex-wrap">{children}</div>

      <div className="flex space-x-2 w-full mt-3 md:mt-0 md:w-6/12 justify-center md:justify-end flex-wrap">
        {actions}
      </div>
    </header>
  );
}

export default TableCardHeader;
