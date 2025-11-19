import { GroupHeader } from "../grouped/GroupHeader";
import { GroupItem } from "../grouped/GroupItem";
import { GroupSummary } from "../grouped/GroupSummary";
import { calculateGroupTotal, calculateGroupItems } from "../../utils/calculations";

export const GroupedView = ({ groupedDetails, expandedGroups, toggleGroup }) => {
  return (
    <div className="space-y-4">
      {Object.entries(groupedDetails).map(([shoppingId, group]) => {
        const isExpanded = expandedGroups[shoppingId];
        const items = group.items;
        const groupTotal = calculateGroupTotal(items);
        const groupItems = calculateGroupItems(items);

        return (
          <div
            key={shoppingId}
            className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all"
          >
            <GroupHeader
              shoppingId={shoppingId}
              shopping={group.shopping}
              items={items}
              groupTotal={groupTotal}
              groupItems={groupItems}
              isExpanded={isExpanded}
              toggleGroup={toggleGroup}
            />

            {isExpanded && (
              <div className="border-t border-slate-200 bg-slate-50">
                <div className="p-6 space-y-3">
                  {items.map((detail) => (
                    <GroupItem key={detail.id} detail={detail} />
                  ))}
                  <GroupSummary 
                    items={items} 
                    groupTotal={groupTotal} 
                    groupItems={groupItems} 
                  />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
export default GroupedView;