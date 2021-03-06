const { app, BrowserWindow, Menu, globalShortcut } = require('electron');
const path = require('path');
const url = require('url');

const setShortcut = require('./shortcut.js');

let win;
const setName = 'Mondo';

function createWindow () {
  // 创建浏览器窗口。
  win = new BrowserWindow({width: 1000, height: 600, resizable: true}); // transparent: true,

  // 然后加载应用的 index.html。
  const startUrl = process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : url.format({
        pathname: path.join(__dirname, '../index.html'),
        protocol: 'file:',
        slashes: true
    });
  
  win.loadURL(startUrl);

  // 移除顶部菜单栏
  Menu.setApplicationMenu(null);

  // 程序按键设置
  setShortcut.openDevTools(win);


  // 当 window 被关闭，这个事件会被触发。
  win.on('closed', () => {
    // 取消引用 window 对象，如果你的应用支持多窗口的话，
    // 通常会把多个 window 对象存放在一个数组里面，
    // 与此同时，你应该删除相应的元素。
    win = null;
    // 清空所有快捷键
    globalShortcut.unregisterAll();
  })
}

// Electron 会在初始化后并准备
// 创建浏览器窗口时，调用这个函数。
// 部分 API 在 ready 事件触发后才能使用。
app.on('ready', createWindow);

app.setName(setName);

// 当全部窗口关闭时退出。
app.on('window-all-closed', () => {
  // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
  // 否则绝大部分应用及其菜单栏会保持激活。
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', () => {
  // 在macOS上，当单击dock图标并且没有其他窗口打开时，
  // 通常在应用程序中重新创建一个窗口。
  if (win === null) {
    createWindow();
  }
});