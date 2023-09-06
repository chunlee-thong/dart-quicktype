const SmTitle = (props: { title: string; subtitle?: string }) => {
  return (
    <div className="flex flex-row">
      <h1 className="text-white text-sm font-semibold">{props.title}</h1>
      {props.subtitle && <h1 className="text-white text-sm ml-2">{props.subtitle}</h1>}
    </div>
  );
};

export default SmTitle;
