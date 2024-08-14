import Header from '@/components/Header';
import './style.css';
import Sidebar from '@/components/Sidebar';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body>
        <div className='container'>
          <div className='main'>
            <Sidebar />
            <section
              className='col note-viewer'
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'start',
                height: '100%',
              }}
            >
              <Header />
              <div style={{ height: '100%', width: '100%' }}>{children}</div>
            </section>
          </div>
        </div>
      </body>
    </html>
  );
}
