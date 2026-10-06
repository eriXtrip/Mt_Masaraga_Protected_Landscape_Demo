import GetInTouch from './GetInTouch';
import ContactMap from './ContactMap';

export default function Contact() {
    return (
        <div className="flex min-h-dvh flex-col bg-surface">
            <main className="-mt-13 flex-1 lg:-mt-14">
                <GetInTouch />
                <ContactMap />
            </main>
        </div>
    );
}