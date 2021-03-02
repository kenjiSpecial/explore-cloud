import React, { FunctionComponent } from 'react';
import { faunaCreatePostAction } from '@utils/fauna-action';
import { Editor, EditorState } from 'draft-js';
import { Client } from 'faunadb';

export const Blog: FunctionComponent<{ client?: Client; postsEl?: JSX.Element }> = (props: {
  client?: Client;
  postsEl?: JSX.Element;
}) => {
  const [editorState, setEditorState] = React.useState(() => EditorState.createEmpty());
  //
  const onChange = (val: EditorState) => setEditorState(val);

  // useEffect(() => {
  //   (async () => {
  //     if (!client) return;
  //     console.log(client);
  //     const initPosts = await faunaGetPostsAction(client);
  //     setPosts(initPosts);
  //   })();
  // }, [client]);

  function onClickHandler(event: React.FormEvent<HTMLButtonElement>) {
    const contentState = editorState.getCurrentContent();
    const textArr = contentState.getBlocksAsArray().map((block) => block.getText());
    if (props.client) {
      faunaCreatePostAction(props.client, textArr);
    }

    event.preventDefault();
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
