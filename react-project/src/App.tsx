import './App.css'
import { Tabs, TabsList, TabsTrigger, TabsPanel } from './tabs/Tabs'
import Carousel from './carousel/Carousel'

const images = [
  'https://picsum.photos/id/1015/400/200',
  'https://picsum.photos/id/1016/400/200',
  'https://picsum.photos/id/1018/400/200',
]

export default function App() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Vite + React with Tabs</h1>
      <Tabs defaultValue="a">
        <TabsList>
          <TabsTrigger value="a">Tab A</TabsTrigger>
          <TabsTrigger value="b">Tab B</TabsTrigger>
        </TabsList>
        <TabsPanel value="a">This is panel A</TabsPanel>
        <TabsPanel value="b">This is panel B</TabsPanel>
      </Tabs>
      <div style={{ marginTop: '3rem' }}>
        <h2>Carousel Demo</h2>
        <Carousel>
          <Carousel.Slides>
            {images.map((image, index) => (
              <Carousel.Slide key={index}>
                <img src={image} alt={`Slide ${index + 1}`} />
              </Carousel.Slide>
            ))}
          </Carousel.Slides>
          <Carousel.Prev />
          <Carousel.Next />
          <Carousel.Indicators />
        </Carousel>
      </div>
    </div>
  )
}