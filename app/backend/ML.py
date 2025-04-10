import torch.nn as nn
import torch.nn.functional as f
import torchvision.transforms as transforms
import torch
from PIL import Image


# define the RESNET 9 model architecture
class SimpleResidualBlock(nn.Module):
    def __init__(self):
        super().__init__()
        self.conv1 = nn.Conv2d(in_channels=3, out_channels=3, kernel_size=3, stride=1, padding=1)
        self.relu1 = nn.ReLU()
        self.conv2 = nn.Conv2d(in_channels=3, out_channels=3, kernel_size=3, stride=1, padding=1)
        self.relu2 = nn.ReLU()

    def forward(self, x):
        out = self.conv1(x)
        out = self.relu1(out)
        out = self.conv2(out)
        return self.relu2(out) + x # ReLU can be applied before or after adding the input


# base class for the model
class ImageClassificationBase(nn.Module): # most of this code is just training code, so it is omitted. Commented out.
    pass

# convolution block with BatchNormalization
def ConvBlock(in_channels, out_channels, pool=False):
    layers = [nn.Conv2d(in_channels, out_channels, kernel_size=3, padding=1),
             nn.BatchNorm2d(out_channels),
             nn.ReLU(inplace=True)]
    if pool:
        layers.append(nn.MaxPool2d(4))
    return nn.Sequential(*layers)


# resnet architecture
class ResNet9(ImageClassificationBase):
    def __init__(self, in_channels, num_diseases):
        super().__init__()

        self.conv1 = ConvBlock(in_channels, 64)
        self.conv2 = ConvBlock(64, 128, pool=True) # out_dim : 128 x 64 x 64
        self.res1 = nn.Sequential(ConvBlock(128, 128), ConvBlock(128, 128))

        self.conv3 = ConvBlock(128, 256, pool=True) # out_dim : 256 x 16 x 16
        self.conv4 = ConvBlock(256, 512, pool=True) # out_dim : 512 x 4 x 44
        self.res2 = nn.Sequential(ConvBlock(512, 512), ConvBlock(512, 512))

        self.classifier = nn.Sequential(nn.MaxPool2d(4),
                                       nn.Flatten(),
                                       nn.Linear(512, num_diseases))

    def forward(self, xb): # xb must always be a batch, bear that in mind.
        out = self.conv1(xb)
        out = self.conv2(out)
        out = self.res1(out) + out
        out = self.conv3(out)
        out = self.conv4(out)
        out = self.res2(out) + out
        out = self.classifier(out)
        return out



# this is an aggregate object of the prediction of the ML model
class Result:
    def __init__(self, plant: str, disease: str, confidence_value: float):
        self.plant = plant
        self.disease = disease
        self.probability = confidence_value

# this is the ML model abstraction for the backend implementation
class MLModel():

    def __init__(self):
        self.preprocess = transforms.Compose([transforms.Resize((256,256)),
                                                transforms.ToTensor()])

        self.model = torch.load("plant-disease-model-complete.pth", weights_only= False, map_location=torch.device('cpu'))

        self.mappings = [('Apple', 'Apple scab'),
                        ('Apple', 'Black rot'),
                        ('Apple', 'Cedar apple rust'),
                        ('Apple', 'healthy'),
                        ('Blueberry', 'healthy'),
                        ('Cherry (including sour)', 'Powdery mildew'),
                        ('Cherry (including sour)', 'healthy'),
                        ('Corn (maize)', 'Cercospora leaf spot Gray leaf spot'),
                        ('Corn (maize)', 'Common rust '),
                        ('Corn (maize)', 'Northern Leaf Blight'),
                        ('Corn (maize)', 'healthy'),
                        ('Grape', 'Black rot'),
                        ('Grape', 'Esca (Black Measles)'),
                        ('Grape', 'Leaf blight (Isariopsis Leaf Spot)'),
                        ('Grape', 'healthy'),
                        ('Orange', 'Haunglongbing (Citrus greening)'),
                        ('Peach', 'Bacterial spot'),
                        ('Peach', 'healthy'),
                        ('Pepper, bell', 'Bacterial spot'),
                        ('Pepper, bell', 'healthy'),
                        ('Potato', 'Early blight'),
                        ('Potato', 'Late blight'),
                        ('Potato', 'healthy'),
                        ('Raspberry', 'healthy'),
                        ('Soybean', 'healthy'),
                        ('Squash', 'Powdery mildew'),
                        ('Strawberry', 'Leaf scorch'),
                        ('Strawberry', 'healthy'),
                        ('Tomato', 'Bacterial spot'),
                        ('Tomato', 'Early blight'),
                        ('Tomato', 'Late blight'),
                        ('Tomato', 'Leaf Mold'),
                        ('Tomato', 'Septoria leaf spot'),
                        ('Tomato', 'Spider mites Two-spotted spider mite'),
                        ('Tomato', 'Target Spot'),
                        ('Tomato', 'Tomato Yellow Leaf Curl Virus'),
                        ('Tomato', 'Tomato mosaic virus'),
                        ('Tomato', 'healthy')]


    def __call__(self, img: Image) -> Result:
        results = self.model.forward(self.preprocess(img).unsqueeze(0))
        norm_probability = f.softmax(results, 1).squeeze(0)
        prediction = self.mappings[torch.argmax(norm_probability)]

        return Result(prediction[0], prediction[1], torch.max(norm_probability).item())


if __name__ == '__main__':
    x = MLModel()
    print(type(x.model))