import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
export const useMailStore = defineStore('mail', () => {
  const messages = ref([
    {
      id: '1',
      sender: 'Tomaslau',
      subject: 'Welcome to Ubold!',
      body: 'Hello John,\nWelcome to your new workspace. Review the dashboard and explore the component library.\nThanks,\nTomaslau',
      date: '10:42 AM',
      read: false,
      starred: true,
      folder: 'inbox',
    },
    {
      id: '2',
      sender: 'Chadengle',
      subject: 'Design review meeting',
      body: 'Hi John,\nThe design review is scheduled for tomorrow at 10 AM. Please bring the latest screens.\nBest,\nChad',
      date: '9:30 AM',
      read: false,
      starred: false,
      folder: 'inbox',
    },
    {
      id: '3',
      sender: 'Stillnotdavid',
      subject: 'Project updates',
      body: 'Hi team,\nThe latest project updates are ready for review. Let us know your feedback.\nRegards,\nDavid',
      date: 'Yesterday',
      read: true,
      starred: false,
      folder: 'inbox',
    },
    {
      id: '4',
      sender: 'John Doe',
      subject: 'Invoice for October',
      body: 'Hello,\nPlease review the sample invoice in the workspace. No payment is required for this demo.',
      date: 'Yesterday',
      read: true,
      starred: false,
      folder: 'inbox',
    },
  ])
  const draft = reactive({
    to: '',
    subject: '',
    body: '<p>Hello,</p><p>Write your message here.</p>',
  })
  return { messages, draft }
})
