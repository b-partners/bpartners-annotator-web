import { FC, createContext, useContext } from 'react';
import { ICanvasContext, ICanvasEditorProviderProps } from '.';

const CanvasEditorContext = createContext<ICanvasContext>({
    zoom: {
        resetZoom: () => {},
        zoomIn: () => {},
        zoomOut: () => {}
    }
});

export const CanvasEditorProvider: FC<ICanvasEditorProviderProps> = ({ children, zoom }) => {
    return (
        <CanvasEditorContext.Provider
            value={{
                zoom
            }}
        >
            {children}
        </CanvasEditorContext.Provider>
    );
};

export const useCanvasEditorContext = () => useContext(CanvasEditorContext);
