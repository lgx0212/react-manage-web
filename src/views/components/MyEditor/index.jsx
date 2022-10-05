import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import "@wangeditor/editor/dist/css/style.css"; // 引入 css
import { Editor, Toolbar } from "@wangeditor/editor-for-react";

const MyEditor = forwardRef((props, ref) => {
  const [editor, setEditor] = useState(null);
  const [html, setHtml] = useState("");
  useImperativeHandle(ref, () => ({
    resetEditor: resetEditor,
    editEditor: editEditor
  }));
  // 工具栏配置
  const toolbarConfig = {};
  // 编辑器配置
  const editorConfig = {
    placeholder: "请输入内容...",
    MENU_CONF: {},
  };
  editorConfig.MENU_CONF["uploadImage"] = {
    // 其他配置...

    // 小于该值就插入 base64 格式（而不上传），默认为 0
    base64LimitSize: 1024 * 1024, // 1024kb
  };
  // 及时销毁 editor ，重要！
  useEffect(() => {
    return () => {
      if (editor == null) return;
      editor.destroy();
      setEditor(null);
    };
  }, [editor]);
  const editorChange = (editor) => {
    setHtml(editor.getHtml());
    props.editContent(editor.getHtml());
  };
  function resetEditor() {
    setHtml('')
  }
  function editEditor(value) {
    setHtml(value)
  }
  return (
    <>
      <div style={{ border: "1px solid #ccc", zIndex: 100 }}>
        <Toolbar
          editor={editor}
          defaultConfig={toolbarConfig}
          mode="default"
          style={{ borderBottom: "1px solid #ccc" }}
        />
        <Editor
          defaultConfig={editorConfig}
          value={html}
          onCreated={setEditor}
          onChange={(editor) => editorChange(editor)}
          mode="default"
          style={{ height: "300px", overflowY: "hidden" }}
        />
      </div>
    </>
  );
});
export default MyEditor;
