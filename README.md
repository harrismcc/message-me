![CleanShot 2024-07-17 at 13 23 26@2x](https://github.com/user-attachments/assets/d99a0a6d-2bb7-47b0-b045-0f70fd90309a)

# Untitled Notes App

This project was inspired by [Raycast](https://www.raycast.com/), specifically their "Floating Notes" feature. I liked the concept of a floating notes app that could pop up with a hotkey, appearing above all other apps. However, Raycast's implementation is pretty much a floating text box, and has no rich text editing and can't save or share notes. Thus, I decided to build my own with the following features/objectives:

- Should be able to pop up above anything. Full screen apps, meetings, anything.
- Should be hotkey-oriented, so that users can quickly interact with the app w/o context switching
- Offline. V1 of this app tried to set things up as a live service and that was not very useful. The app should be offline-first to prioritize being fast.
- Rich text editing. I need more than just text, I want images, headings, links, and more.
- Insanely searchable. The notes should be super searchable so that users can find whatever they are looking for quickly. If AI is to be used anywhere in the app, it should be to make search awesome.


# Architecture & Tools
The app is built using [Tauri](https://tauri.app/) (because it's worlds faster and lighter than Electron), [Drizzle](https://orm.drizzle.team/), and SQLite. Additionally, local AI features are powered by [Ollama](https://ollama.com/)

