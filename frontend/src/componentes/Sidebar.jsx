const Sidebar = ({ channels, onSelect }) => {
  return (
    <div className="sidebar">
      <h2>Canales</h2>

      {channels.map((c) => (
        <div 
          key={c.id} 
          className="channel-item"
          onClick={() => onSelect(c.id)}
        >
          {c.name}
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
