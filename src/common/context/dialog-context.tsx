import { Dialog, Slide } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { FC, ReactNode, createContext, forwardRef, useContext, useState } from 'react';
import { IDialogState } from './type';

const context = createContext<IDialogState>({
    isOpen: false,
    content: <div></div>,
    setState: () => {}
});

export const useDialog = () => {
    const { setState, ...others } = useContext(context);

    const openDialog = (content: ReactNode) => setState({ content, isOpen: true });
    const closeDialog = () => setState({ content: <div></div>, isOpen: false });

    return { openDialog, closeDialog, ...others };
};

const Transition = forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>
) {
    return <Slide direction='up' ref={ref} {...props} />;
});

export const DialogProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [state, setState] = useState<Omit<IDialogState, 'setState'>>({
        isOpen: false,
        content: <div></div>
    });

    return (
        <context.Provider value={{ ...state, setState }}>
            {children}
            <Dialog
                open={state.isOpen}
                sx={{ minWidth: '50vw' }}
                TransitionComponent={Transition}
                keepMounted
                onClose={() => setState(e => ({ ...e, isOpen: false }))}
            >
                {state.content}
            </Dialog>
        </context.Provider>
    );
};
