import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { Board, User, Stack, Card } from "@prisma/client";

interface CurrentBoard {
    currentBoard:
        | (Board & { users: User[]; stacks: (Stack & { cards: Card[] })[] })
        | null;
}

interface UpdateStacks {
    cardId: string | undefined;
    oldStackId: string | undefined;
    newStackId: string | undefined;
    newCardIndex: number | null;
}

const initialState: CurrentBoard = {
    currentBoard: null,
};

export const BoardSlice = createSlice({
    name: "currentBoard",
    initialState,
    reducers: {
        updateStacks: (state, action: PayloadAction<UpdateStacks>) => {
            let cardToUpdate: Card | undefined;
            const removeCard: (Stack & { cards: Card[] })[] | null =
                state.currentBoard &&
                state.currentBoard.stacks.map((stack) => {
                    if (stack.id === action.payload.oldStackId) {
                        stack.cards = [...stack.cards].filter((card) => {
                            if (card.id !== action.payload.cardId) {
                                return true;
                            } else {
                                cardToUpdate = card;
                                return false;
                            }
                        });
                    }
                    return stack;
                });
            const addCard: (Stack & { cards: Card[] })[] | null =
                removeCard?.map((stack) => {
                    if (stack.id === action.payload.newStackId) {
                        if (stack.cards && cardToUpdate) {
                            if (!action.payload.newCardIndex) {
                                stack.cards = [cardToUpdate, ...stack.cards];
                            } else {
                                stack.cards.splice(
                                    action.payload.newCardIndex,
                                    0,
                                    cardToUpdate
                                );
                            }
                        } else {
                            stack.cards = cardToUpdate
                                ? [cardToUpdate]
                                : [...stack.cards];
                        }
                    }
                    return stack;
                }) || null;
            const currentBoard =
                addCard && state.currentBoard
                    ? { ...state.currentBoard, stacks: addCard }
                    : state.currentBoard
                    ? { ...state.currentBoard }
                    : null;

            return { currentBoard };
        },

        addNewStack: (
            state,
            action: PayloadAction<Stack & { cards: Card[] }>
        ) => {
            const updated = state.currentBoard
                ? [...state.currentBoard.stacks, action.payload]
                : [];
            const currentBoard =
                updated && state.currentBoard
                    ? { ...state.currentBoard, stacks: updated }
                    : state.currentBoard
                    ? { ...state.currentBoard }
                    : null;
            return { currentBoard };
        },

        addNewCard: (state, action: PayloadAction<Card>) => {
            const cardStack = action.payload.stackId;
            const newStacks =
                state.currentBoard &&
                state.currentBoard.stacks.map((stack) => {
                    if (stack.id === cardStack) {
                        stack.cards = stack.cards
                            ? [...stack.cards, action.payload]
                            : [action.payload];
                    }
                    return stack;
                });
            const currentBoard =
                newStacks && state.currentBoard
                    ? { ...state.currentBoard, stacks: newStacks }
                    : state.currentBoard
                    ? { ...state.currentBoard }
                    : null;
            return { currentBoard };
        },
    },
});

export const { updateStacks, addNewStack, addNewCard } = BoardSlice.actions;
