import React, { FunctionComponent } from 'react';
import { FPost } from '@utils/fauna-action';
import { Editor, EditorState } from 'draft-js';

/**
 *
 */
function generateID() {
  // Math.random should be unique because of its seeding algorithm.
  // Convert it to base 36 (numbers + letters), and grab the first 9 characters
  // after the decimal.
  return Math.random().toString(36).substr(2, 9);
}

export const Blog: FunctionComponent<{
  postsEl?: JSX.Element;
  postFunc?: (val: { id: string; text: string }[]) => Promise<any>;
  callback?: (val: FPost) => void;
}> = (props: {
  postsEl?: JSX.Element;
  postFunc?: (val: { id: string; text: string }[]) => Promise<any>;
  callback?: (val: FPost) => void;
}) => {
  const [editorState, setEditorState] = React.useState(() => EditorState.createEmpty());

  const onChange = (val: EditorState) => setEditorState(val);

  function onClickHandler(event: React.FormEvent<HTMLButtonElement>) {
    event.preventDefault();
    (async () => {
      const contentState = editorState.getCurrentContent();
      const textArr = contentState.getBlocksAsArray().map((block) => ({
        id: generateID(),
        text: block.getText(),
      }));
      if (props.postFunc) {
        const res = await props.postFunc(textArr);
        setEditorState(EditorState.createEmpty());
        if (props.callback) {
          props.callback(res);
        }
      }
    })();
  }

  return (
    <div className="relative w-full">
      <div className="max-w-prose mx-auto text-lg">
        <div className="py-16 px-4 sm:px-6 lg:px-8 text-gray-500">
          <div className="border border-gray-600 p-4 rounded-md">
            <Editor editorKey="edittor" editorState={editorState} onChange={onChange} />
          </div>
          <div className="flex flex-row-reverse mt-4">
            <button
              type="submit"
              className="justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={onClickHandler}
            >
              Publish
            </button>
          </div>
        </div>

        <div>{props.postsEl}</div>
      </div>
    </div>
  );
};
