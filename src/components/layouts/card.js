function Card(props) {
  return (
    <div className="bg-white rounded-3xl px-2 py-8 md:px-6 w-full">
      {props.children}
    </div>
  );
}

export default Card;
