import { useExperienceActions } from "../hooks/useExperienceActions";
import { orbitLabelElements, useOrbitLabels } from "./orbitLabels";

/** Camada DOM dos rótulos da órbita, posicionada pelo <Orbit /> via projeção da câmera. */
export function OrbitLabels() {
  const groups = useOrbitLabels((s) => s.groups);
  const { selectProduct, hoverProduct } = useExperienceActions();
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Object.values(groups)
        .flat()
        .map((item) => (
          <button
            key={item.id}
            ref={(el) => {
              if (el) orbitLabelElements.set(item.id, el);
              else orbitLabelElements.delete(item.id);
            }}
            type="button"
            tabIndex={-1}
            className="orbit-label absolute top-0 left-0"
            style={{ opacity: 0, pointerEvents: "none" }}
            onClick={() => selectProduct(item.id)}
            onPointerEnter={() => hoverProduct(item.id)}
            onPointerLeave={() => hoverProduct(undefined)}
          >
            {item.label}
          </button>
        ))}
    </div>
  );
}
