import './index.scss';
import { useState, useEffect } from 'react';
import { ExpandBox } from '../Utils';
import { titleize } from '../../utils';


interface ItemListProps {
    item_type: "spells"|"equipment";
    item_category: string|number;
    items: any[];
    editItem: (item_name: string, key: string, action: 'edit'|'remove', new_item?: object) => void;
}

export default function ItemList({
    item_type,
    item_category,
    items,
    editItem,
}: ItemListProps) {

    const [itemboxes, setItemboxes] = useState(items);

    useEffect(() => {
        setItemboxes(items);
    }, [items])

    let title: string;
    if (item_type === 'spells') {
        title = item_category == 0 ? 'Cantrips' : `Level ${item_category} Spells`;
    } else {
        title = titleize(item_category as string);
    }

    const switchMode = (item_name: string): void => {
        const updated_itemboxes = itemboxes.map(item => {
            if (item.name === item_name) {
                item['editing'] = !item['editing'];
            }
            return item;
        });
        setItemboxes(updated_itemboxes);
    }

    const saveItem = (event, item_name: string): void => {
        event.preventDefault();

        const fields = event.target.querySelectorAll('.form-field');
        const new_item = {
            'editing': false,
        };
        fields.forEach(field => {
            new_item[field.name] = field.value;
        })

        editItem(item_name, item_type, 'edit', new_item);
    }

    return (
        <div className="item-list">
            <h4>{title}</h4>
            <ul>
                { itemboxes.map(item => {
                    return (
                        <li key={item.name} className="sheet-section" data-spell-name={item.name}>
                            {(item.editing) ?
                                <form onSubmit={(event) => saveItem(event, item.name)}>
                                    <div className="flex space-between">
                                        <input name="name" className="form-field" type="text" placeholder="Name" defaultValue={item.name} />
                                        <span>
                                            <button type="submit" className="button">save</button>
                                            <a className="button red" onClick={() => editItem(item.name, item_type, 'remove')}>remove</a>
                                        </span>
                                    </div>
                                    {item.quantity && 
                                        <>
                                            <label>Quantity: </label>
                                            <input className="form-field" type="number" name="quantity" defaultValue={item.quantity} min="0" placeholder="Quantity" />
                                        </>
                                    }
                                    <textarea className="form-field" name="description" defaultValue={item.description} style={{ width: '100%', height: '100px', fontSize: '90%' }} />
                                </form>
                            :
                                <>
                                    <div className="flex space-between">
                                        <span>
                                            <strong>{item.name}</strong>
                                            {item.quantity && ` (${item.quantity})`}
                                        </span>
                                        <span>
                                            <a className="button" onClick={() => switchMode(item.name)}>edit</a>
                                            <a className="button red" onClick={() => editItem(item.name, item_type, 'remove')}>remove</a>
                                        </span>
                                    </div>
                                    <ExpandBox style={{fontSize: '90%'}}>{item.description}</ExpandBox>
                                </>
                            }
                        </li>
                    )
                }) }
            </ul>
        </div>
    )
}