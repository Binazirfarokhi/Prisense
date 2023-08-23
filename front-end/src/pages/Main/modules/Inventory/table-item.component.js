export const TableItem = ({item, mode, onSelected}) => {
    let { name, product_category, supply_price, id, activated } = item;
    let selected = item.selected || false;
    console.log(activated)
    return (
        <tr className={activated? "":"disabled"}>
            <td>{mode === 1 && <input type="checkbox" checked={selected || false} onChange={(e)=> {
                selected = !selected;
                onSelected(id,selected);
                }} disabled={!activated} />}</td>
            <td>{name}</td>
            <td>{product_category}</td>
            <td><input value={supply_price} onChange={(e)=> e.target.value = supply_price} disabled={!activated} /></td>
            <td>{"YES"}</td>
        </tr>
    );
}