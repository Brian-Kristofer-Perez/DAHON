import sqlalchemy.orm
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import Relationship
from . import DB
from sqlalchemy.dialects.mysql import MEDIUMBLOB # haha blob blob very funnyyy

# Define the Base class from DB
Base = DB.Base

class User(Base):
    __tablename__ = 'user'
    id = Column('id', Integer, primary_key=True)
    username = Column('username', String(20))
    password = Column('password', String(20))


class Scan(Base):
    __tablename__ = 'scan'
    id = Column('id', Integer, primary_key=True)
    userID = Column('userID', ForeignKey('user.id'))
    image = Column('image', MEDIUMBLOB)
    date = Column('datetime', sqlalchemy.DATETIME)
    plantID = Column('predicted_plant', ForeignKey('plant.id'))
    diseaseID = Column('predicted_disease', ForeignKey('disease.id'))
    predicted_plant = Relationship('Plant')
    predicted_disease = Relationship('Disease')

    def to_dict(self):
        output = {
                'image': self.image,
                'date': self.date.isoformat(),
                'predicted_plant': self.predicted_plant.to_dict(),
                'predicted_disease': self.predicted_disease.to_dict(),
                 }

        return output


class Plant(Base):
    __tablename__ = 'plant'
    id = Column('id', Integer, primary_key=True)
    common_name = Column('common_name', String(25))
    scientific_name = Column('scientific_name', String(75))
    family = Column('family', String(30))
    type = Column('type', String(30))
    growth_conditions = Relationship('GrowthCondition')


    def to_dict(self):
        output = {
            'common_name': self.common_name,
            'scientific_name': self.scientific_name,
            'family': self.family,
            'type': self.type,
            'growth_conditions': self.growth_conditions[0].to_dict()
        }
        return output


class GrowthCondition(Base):
    __tablename__ = 'growth_condition'
    id = Column('id', Integer, primary_key=True)
    plantID = Column('plantID', ForeignKey('plant.id'))
    soil_type = Column('soil_type', String(200))
    light = Column('light', String(200))
    water = Column('water_needs', String(200))
    temperature = Column('temperature', String(200))

    def to_dict(self):
        output = {
            'soil_type': self.soil_type,
            'light': self.light,
            'water': self.water,
            'temperature': self.temperature
        }

        return output


class Disease(Base):
    __tablename__ = 'disease'
    id = Column('id', Integer, primary_key=True)
    name = Column('name', String(75))
    species_affected = Relationship('SpeciesAffected')
    symptoms =  Relationship('Symptom')
    cause = Column('cause', String(300))
    treatment = Relationship('Treatment')
    prevention = Relationship('Prevention')
    severity = Column('severity', String(300))
    # images of disease, add later!

    def to_dict(self):
        output = {
            'name': self.name,
            'species_affected': [spec.species for spec in self.species_affected],
            'symptoms': [s.symptom for s in self.symptoms],
            'cause': self.cause,
            'treatment': [t.treatment for t in self.treatment],
            'prevention': [p.prevention for p in self.prevention],
            'severity': self.severity
        }
        return output


class SpeciesAffected(Base):
    __tablename__ = 'species_affected'
    id = Column('id', Integer, primary_key=True)
    diseaseID = Column('diseaseID', ForeignKey('disease.id'))
    species = Column('species', String(75))


class Symptom(Base):
    __tablename__ = 'symptom'
    id = Column('id', Integer, primary_key=True)
    diseaseID = Column('diseaseID', ForeignKey('disease.id'))
    symptom = Column('symptom', String(250))


class Treatment(Base):
    __tablename__ = 'treatment'
    id = Column('id', Integer, primary_key=True)
    diseaseID = Column('diseaseID', ForeignKey('disease.id'))
    treatment = Column('treatment', String(250))


class Prevention(Base):
    __tablename__ = 'prevention'
    id = Column('id', Integer, primary_key=True)
    diseaseID = Column('diseaseID', ForeignKey('disease.id'))
    prevention = Column('prevention', String(250))


if __name__ == '__main__':
    # Base.metadata.create_all(DB.engine)

    Session = DB.SessionLocal
    tomato = Plant(
        common_name="Tomato",
        scientific_name="Solanum lycopersicum",
        family="Solanaceae",
        type="Fruit",
        growth_conditions=[
            GrowthCondition(
                soil_type="Well-drained, loamy soil; pH 6.0–6.8",
                light="Full sun (6–8+ hours/day)",
                water="Regular, deep watering (keep soil consistently moist but not soggy)",
                temperature="Warm-season; ideal temperature range: 70–85°F (21–29°C)"
            )
        ]
    )

    grape = Plant(
        common_name="Grape",
        scientific_name="Vitis vinifera (European grape), Vitis labrusca (American grape), etc.",
        family="Vitaceae",
        type="Fruit",
        growth_conditions=[
            GrowthCondition(
                soil_type="Well-drained, sandy or loamy soils; pH 5.5–7.0",
                light="Full sun",
                water="Moderate; avoid overwatering",
                temperature="Temperate to warm climates; need hot, dry summers and mild winters"
            )
        ]
    )

    blueberry = Plant(
        common_name="Blueberry",
        scientific_name="Vaccinium corymbosum (Highbush), Vaccinium angustifolium (Lowbush)",
        family="Ericaceae",
        type="Fruit",
        growth_conditions=[
            GrowthCondition(
                soil_type="Acidic, well-drained soil; pH 4.5–5.5",
                light="Full sun",
                water="Keep soil consistently moist",
                temperature="Temperate to cool climates; highbush types need winter chill"
            )
        ]
    )

    cherry = Plant(
        common_name="Cherry",
        scientific_name="Prunus avium (Sweet cherry), Prunus cerasus (Sour cherry)",
        family="Rosaceae",
        type="Fruit",
        growth_conditions=[
            GrowthCondition(
                soil_type="Well-drained, sandy or loamy soil; pH 6.0–7.5",
                light="Full sun",
                water="Moderate; avoid waterlogging",
                temperature="Temperate climates with cold winters (for dormancy) and mild springs"
            )
        ]
    )

    strawberry = Plant(
        common_name="Strawberry",
        scientific_name="Fragaria × ananassa",
        family="Rosaceae",
        type="Fruit",
        growth_conditions=[
            GrowthCondition(
                soil_type="Well-drained, sandy loam; pH 5.5–6.8",
                light="Full sun",
                water="Regular moisture; do not let soil dry out completely",
                temperature="Cool to temperate; perform best with warm days and cool nights"
            )
        ]
    )

    pepper_bell = Plant(
        common_name="Pepper Bell",
        scientific_name="Capsicum annuum",
        family="Solanaceae",
        type="Fruit",
        growth_conditions=[
            GrowthCondition(
                soil_type="Fertile, well-drained soil; pH 6.0–6.8",
                light="Full sun",
                water="Consistent watering, especially during fruit development",
                temperature="Warm-season crop; grows best between 70–85°F (21–29°C)"
            )
        ]
    )

    orange = Plant(
        common_name="Orange",
        scientific_name="Citrus × sinensis",
        family="Rutaceae",
        type="Fruit",
        growth_conditions=[
            GrowthCondition(
                soil_type="Well-drained, loamy soil; pH between 6.0–7.0",
                light="Full sun (minimum 6–8 hours of direct sunlight daily)",
                water="Regular, deep watering; keep soil consistently moist but not waterlogged. Allow the top inch of soil to dry between waterings.",
                temperature="Warm, subtropical to tropical climates; ideal temperature range: 68–85°F (20–29°C). Sensitive to frost; protection needed in cooler regions."
            )
        ]
    )

    soybean = Plant(
        common_name="Soybean",
        scientific_name="Glycine max",
        family="Fabaceae",
        type="Legume",
        growth_conditions=[
            GrowthCondition(
                soil_type="Well-drained, fertile loamy soil; pH between 6.0–7.0",
                light="Full sun (minimum 6–8 hours of direct sunlight daily)",
                water="Consistent moisture is essential, especially during flowering and pod development. Avoid waterlogging.",
                temperature="Warm-season crop; optimal temperature range: 70–95°F (21–35°C). Sensitive to frost; best planted after the last frost date."
            )
        ]
    )

    squash = Plant(
        common_name="Squash",
        scientific_name="Cucurbita pepo",
        family="Cucurbitaceae",
        type="Fruit",
        growth_conditions=[
            GrowthCondition(
                soil_type="Well-drained, fertile loamy soil; pH between 5.8–6.8",
                light="Full sun (minimum 6–8 hours of direct sunlight daily)",
                water="Regular, deep watering; keep soil consistently moist but not waterlogged. Avoid overhead watering to reduce disease risk.",
                temperature="Warm-season crop; optimal temperature range: 70–95°F (21–35°C). Sensitive to frost; plant after the last frost date."
            )
        ]
    )

    potato = Plant(
        common_name="Potato",
        scientific_name="Solanum tuberosum",
        family="Solanaceae",
        type="Tuberous root vegetable",
        growth_conditions=[
            GrowthCondition(
                soil_type="Well-drained, loose, and friable soils rich in organic matter. Sandy loam and loamy soils are ideal. pH 5.0 to 6.5",
                light="Full sun; requires at least 6–8 hours of direct sunlight daily for optimal growth",
                water="Requires consistent moisture, especially during tuber formation. Ensure the soil remains moist but not waterlogged.",
                temperature="Cool-season crop. Ideal growing temperatures range between 60–70°F (16–21°C). Sensitive to frost; plant after last frost when soil is at least 45°F (7°C)."
            )
        ]
    )

    corn = Plant(
        common_name="Corn",
        scientific_name="Zea mays",
        family="Poaceae",
        type="Annual cereal grain",
        growth_conditions=[
            GrowthCondition(
                soil_type="Well-drained, fertile loamy soils with pH between 5.8 and 7.0; heavy nitrogen feeder",
                light="Full sun, ideally receiving at least 6–8 hours of direct sunlight daily",
                water="Consistent moisture essential, particularly during silking and tasseling. Requires ~15 inches (38 cm) during the season.",
                temperature="Warm temperatures between 60°F and 95°F (16°C to 35°C); frost-free season of 90–120 days depending on variety."
            )
        ]
    )

    peach = Plant(
        common_name="Peach",
        scientific_name="Prunus persica",
        family="Rosaceae",
        type="Deciduous fruit tree",
        growth_conditions=[
            GrowthCondition(
                soil_type="Well-drained, loamy or sandy soil with a pH between 6.0 and 7.0",
                light="Full sun (minimum 6–8 hours of direct sunlight daily)",
                water="Consistent moisture, especially during the first two years; avoid overwatering to prevent root rot",
                temperature="Temperate climates with cold winters; requires 600–900 chilling hours below 45°F (7°C) for optimal fruiting"
            )
        ]
    )

    apple = Plant(
        common_name="Apple",
        scientific_name="Malus domestica",
        family="Rosaceae",
        type="Deciduous fruit tree",
        growth_conditions=[
            GrowthCondition(
                soil_type="Well-drained, loamy soil with a slightly acidic to neutral pH (6.0–7.0). Avoid heavy clay soils.",
                light="Full sun (minimum 6–8 hours of direct sunlight daily). Ample sunlight needed for optimal fruit production.",
                water="Regular watering is essential, especially during dry periods. Deep watering once or twice a week.",
                temperature="Temperate climates with distinct seasons; requires chilling hours (below 45°F or 7°C) during winter for flowering and fruiting."
            )
        ]
    )

    # with Session() as session:
    #     session.add(squash)
    #     session.add(potato)
    #     session.add(corn)
    #     session.add(peach)
    #     session.add(apple)
    #
    #     session.commit()

    # Create Disease object
    tomato_early_blight = Disease(
        name="Tomato: Early Blight",
        cause="Fungal (Alternaria solani)",
        severity="Moderate to severe, especially in warm, wet climates",
        symptoms=[
            Symptom(symptom="Begins on older, lower leaves as small dark spots"),
            Symptom(symptom="Spots expand into concentric rings, forming a characteristic 'bullseye' pattern"),
            Symptom(symptom="Surrounding tissue often turns yellow and the leaf dies"),
            Symptom(symptom="In severe cases, progresses upward causing defoliation"),
            Symptom(symptom="Dark, sunken lesions may develop on stems and fruits, especially near the calyx")
        ],
        treatment=[
            Treatment(
                treatment="Apply fungicides like chlorothalonil, mancozeb, copper-based products, or azoxystrobin"),
            Treatment(treatment="Begin treatments early, especially in humid or wet weather"),
            Treatment(treatment="Remove and destroy infected plant debris"),
            Treatment(treatment="Improve air circulation by pruning and staking")
        ],
        prevention=[
            Prevention(
                prevention="Apply fungicides like chlorothalonil, mancozeb, copper-based products, or azoxystrobin"),
            Prevention(prevention="Begin treatments early, especially in humid or wet weather"),
            Prevention(prevention="Remove and destroy infected plant debris"),
            Prevention(prevention="Improve air circulation by pruning and staking")
        ]
    )

    # Add species affected (Tomato and Potato)
    tomato_early_blight.species_affected = [
        SpeciesAffected(species="Solanum lycopersicum"),  # Tomato
        SpeciesAffected(species="Solanum tuberosum")  # Potato
    ]

    # Create Disease object
    septoria_leaf_spot = Disease(
        name="Tomato: Septoria Leaf Spot",
        cause="Fungal (Septoria lycopersici)",
        severity="Moderate; can significantly reduce yield if untreated",
        symptoms=[
            Symptom(symptom="Tiny, round lesions with dark brown margins and pale gray or tan centers"),
            Symptom(symptom="Often surrounded by a yellow halo"),
            Symptom(symptom="Lesions contain black fruiting bodies (pycnidia) visible with a hand lens"),
            Symptom(symptom="Progresses rapidly in wet conditions, causing defoliation from the bottom up"),
            Symptom(symptom="Fruit is rarely affected but may suffer from sunscald due to leaf loss")
        ],
        treatment=[
            Treatment(treatment="Fungicides with active ingredients like chlorothalonil, mancozeb, or copper"),
            Treatment(treatment="Begin at first sign of disease and repeat at 7–10 day intervals"),
            Treatment(treatment="Remove infected leaves and dispose of them far from garden beds")
        ],
        prevention=[
            Prevention(prevention="Practice 2–3 year crop rotation"),
            Prevention(prevention="Use disease-resistant or tolerant varieties if available"),
            Prevention(prevention="Space plants properly to improve air flow"),
            Prevention(prevention="Avoid overhead watering and keep foliage dry")
        ]
    )

    # Add species affected (Tomato, Eggplant, Potato)
    septoria_leaf_spot.species_affected = [
        SpeciesAffected(species="Solanum lycopersicum"),  # Tomato
        SpeciesAffected(species="Solanum melongena"),  # Eggplant
        SpeciesAffected(species="Solanum tuberosum")  # Potato (rarely)
    ]

    # Create Disease object
    tylcv = Disease(
        name="Tomato: Tomato Yellow Leaf Curl Virus",
        cause="Virus (Tomato yellow leaf curl virus); transmitted by whiteflies",
        severity="Severe – can result in complete crop loss if not managed.",
        symptoms=[
            Symptom(symptom="Young leaves curl upward and turn yellow along the margins"),
            Symptom(symptom="Plants are stunted with limited flowering and fruiting"),
            Symptom(symptom="Fruit may be undersized or fail to develop"),
            Symptom(symptom="Leaves appear thickened and brittle"),
            Symptom(symptom="Symptoms may mimic nutrient deficiencies or herbicide damage")
        ],
        treatment=[
            Treatment(treatment="No cure once infected"),
            Treatment(treatment="Control whitefly populations with insecticidal soaps, neem oil, or imidacloprid"),
            Treatment(treatment="Introduce natural predators (e.g., Encarsia formosa, ladybugs)")
        ],
        prevention=[
            Prevention(prevention="Plant TYLCV-resistant varieties (e.g., ‘Tygress’, ‘BHN 444’)"),
            Prevention(prevention="Use reflective mulches to deter whiteflies"),
            Prevention(prevention="Practice strict sanitation—remove infected plants immediately"),
            Prevention(prevention="Avoid planting tomatoes near whitefly host plants")
        ]
    )

    tylcv.species_affected = [
        SpeciesAffected(species="Solanum lycopersicum"),  # Tomato
        SpeciesAffected(species="Capsicum spp."),  # Pepper
        SpeciesAffected(species="Nicotiana tabacum"),  # Tobacco
        SpeciesAffected(species="Solanum melongena"),  # Eggplant
        SpeciesAffected(species="Phaseolus spp."),  # Beans
        SpeciesAffected(species="Petunia spp.")  # Petunia
    ]

    # Create Disease object
    bacterial_spot = Disease(
        name="Tomato: Bacterial Spot",
        cause="Bacterial (Xanthomonas campestris)",
        severity="Moderate to severe – high humidity can exacerbate disease spread quickly.",
        symptoms=[
            Symptom(symptom="Water-soaked lesions with yellow halos on leaves, stems, and fruit"),
            Symptom(symptom="Spots become brown or black with time"),
            Symptom(symptom="Leaves may become tattered and fall off"),
            Symptom(symptom="Fruit may show small, raised, scabby spots that affect marketability")
        ],
        treatment=[
            Treatment(treatment="Use copper-based bactericides or a combination of copper and mancozeb"),
            Treatment(treatment="Antibiotics like streptomycin (where permitted) may be used under strict guidelines"),
            Treatment(treatment="Remove and destroy infected plant parts")
        ],
        prevention=[
            Prevention(prevention="Use certified disease-free seeds or transplants"),
            Prevention(prevention="Avoid overhead watering to reduce leaf wetness"),
            Prevention(prevention="Rotate crops every 2–3 years with non-solanaceous plants"),
            Prevention(prevention="Sanitize tools and equipment between uses"),
            Prevention(prevention="Apply mulch to prevent splash transmission from soil")
        ]
    )

    bacterial_spot.species_affected = [
        SpeciesAffected(species="Solanum lycopersicum"),  # Tomato
        SpeciesAffected(species="Capsicum spp."),  # Pepper
        SpeciesAffected(species="Solanum melongena"),  # Eggplant
        SpeciesAffected(species="Nicotiana tabacum")  # Tobacco
    ]

    # Create Disease object
    target_spot = Disease(
        name="Tomato: Target Spot",
        cause="Fungal (Alternaria alternata)",
        severity="Moderate to severe – can cause significant defoliation and yield loss under favorable conditions.",
        symptoms=[
            Symptom(symptom="Small, dark, circular lesions with concentric rings"),
            Symptom(symptom="Lesions enlarge and may merge, leading to significant leaf loss"),
            Symptom(symptom="Leaf drop starts from the bottom and progresses upward"),
            Symptom(symptom="May also affect stems and fruit in severe infections")
        ],
        treatment=[
            Treatment(treatment="Apply fungicides such as chlorothalonil, mancozeb, or copper-based products"),
            Treatment(treatment="Remove severely infected foliage"),
            Treatment(treatment="Reapply fungicides on a regular schedule during humid conditions")
        ],
        prevention=[
            Prevention(prevention="Practice crop rotation and field sanitation"),
            Prevention(prevention="Use drip irrigation to avoid wetting foliage"),
            Prevention(prevention="Improve air circulation by spacing plants adequately"),
            Prevention(prevention="Control weeds that may serve as alternate hosts")
        ]
    )

    target_spot.species_affected = [
        SpeciesAffected(species="Solanum lycopersicum"),  # Tomato
        SpeciesAffected(species="Solanum tuberosum"),  # Potato
        SpeciesAffected(species="Capsicum annuum"),  # Bell Pepper
        SpeciesAffected(species="Solanum melongena"),  # Eggplant
        SpeciesAffected(species="Carica papaya")  # Papaya
    ]

    # Create Disease object
    tomato_mosaic_virus = Disease(
        name="Tomato: Tomato Mosaic Virus",
        cause="Viral (Tomato Mosaic Virus)",
        severity="Moderate to high depending on infection timing and crop susceptibility",
        symptoms=[
            Symptom(symptom="Mottling and mosaic patterns on leaves"),
            Symptom(symptom="Leaf curling, distortion, and narrowing"),
            Symptom(symptom="Stunted plant growth"),
            Symptom(symptom="Deformed and discolored fruits"),
            Symptom(symptom="Yield reduction")
        ],
        treatment=[
            Treatment(treatment="No treatment available for viral infections"),
            Treatment(treatment="Remove and destroy infected plants"),
            Treatment(treatment="Disinfect tools and equipment")
        ],
        prevention=[
            Prevention(prevention="Use virus-resistant varieties"),
            Prevention(prevention="Sanitize hands and tools regularly"),
            Prevention(prevention="Avoid smoking in the growing area (tobacco may carry the virus)"),
            Prevention(prevention="Control weed hosts")
        ]
    )

    tomato_mosaic_virus.species_affected = [
        SpeciesAffected(species="Solanum lycopersicum"),  # Tomato
        SpeciesAffected(species="Nicotiana tabacum"),  # Tobacco
        SpeciesAffected(species="Capsicum spp."),  # Pepper
        SpeciesAffected(species="Petunia spp."),  # Petunia
        SpeciesAffected(species="Spinacia oleracea"),  # Spinach
        SpeciesAffected(species="Lactuca sativa"),  # Lettuce
        SpeciesAffected(species="Cucumis sativus"),  # Cucumber
        SpeciesAffected(species="Various ornamentals")  # Ornamentals
    ]

    # Create Disease object
    leaf_mold = Disease(
        name="Tomato: Leaf Mold",
        cause="Fungal (Passalora fulva)",
        severity="Moderate to severe, especially under warm, humid conditions",
        symptoms=[
            Symptom(symptom="Pale green or yellow spots on upper leaf surfaces, which enlarge over time"),
            Symptom(symptom="Fuzzy, olive-green to grayish mold on the underside of leaves directly below spots"),
            Symptom(symptom="Infected leaves may wither, die, and fall off"),
            Symptom(symptom="Typically begins in lower foliage and progresses upward"),
            Symptom(symptom="Fruit and stem infections are rare")
        ],
        treatment=[
            Treatment(treatment="Apply fungicides such as chlorothalonil, copper-based products, or mancozeb"),
            Treatment(treatment="Remove and destroy infected leaves"),
            Treatment(treatment="Disinfect greenhouses and tools between crops")
        ],
        prevention=[
            Prevention(prevention="Ensure good ventilation and air circulation, especially in greenhouses"),
            Prevention(prevention="Avoid overhead watering and high humidity"),
            Prevention(prevention="Use resistant tomato varieties (e.g., those with the Cf gene)"),
            Prevention(prevention="Practice crop rotation and clean up plant debris")
        ]
    )

    leaf_mold.species_affected = [
        SpeciesAffected(species="Solanum lycopersicum"),  # Tomato
        SpeciesAffected(species="Solanum pimpinellifolium")  # Wild tomato (occasionally affected)
    ]

    # Create Disease object
    spider_mites = Disease(
        name="Tomato: Spider Mites",
        cause="Pest (Tetranychus urticae or two-spotted spider mite)",
        severity="Moderate to high; populations can explode rapidly under hot, dry conditions",
        symptoms=[
            Symptom(symptom="Fine webbing on leaves and stems"),
            Symptom(symptom="Stippled, yellow, or bronzed appearance of leaves due to feeding"),
            Symptom(symptom="Leaf curling, drying, and eventual drop"),
            Symptom(symptom="Heavy infestations can severely stunt plant growth or kill seedlings")
        ],
        treatment=[
            Treatment(treatment="Apply insecticidal soaps, neem oil, or horticultural oils"),
            Treatment(treatment="Use predatory mites (e.g., Phytoseiulus persimilis) as biological control"),
            Treatment(treatment="Remove heavily infested leaves")
        ],
        prevention=[
            Prevention(prevention="Keep plants well-watered and reduce drought stress"),
            Prevention(prevention="Ensure proper airflow and humidity in greenhouses"),
            Prevention(prevention="Regularly inspect for early signs of infestation"),
            Prevention(prevention="Avoid over-fertilizing with nitrogen, which can promote mite populations")
        ]
    )

    spider_mites.species_affected = [
        SpeciesAffected(species="Solanum lycopersicum"),  # Tomato
        SpeciesAffected(species="Fragaria × ananassa"),  # Strawberry
        SpeciesAffected(species="Vitis vinifera"),  # Grape
        SpeciesAffected(species="Capsicum spp."),  # Pepper
        SpeciesAffected(species="Solanum melongena"),  # Eggplant
        SpeciesAffected(species="Phaseolus spp."),  # Beans
        SpeciesAffected(species="Cucurbitaceae"),  # Melon, cucumber, squash
        SpeciesAffected(species="Ornamentals")  # Various greenhouse plants
    ]

    # Create Disease object
    leaf_blight_grape = Disease(
        name="Grape: Leaf Blight",
        cause="Fungal (Isariopsis clavispora)",
        severity="Mild to moderate; can become severe under prolonged wet conditions",
        symptoms=[
            Symptom(symptom="Brown to black angular leaf spots, often limited by leaf veins"),
            Symptom(symptom="Concentric ring patterns may develop in spots (similar to target spots)"),
            Symptom(symptom="Leaf yellowing and premature drop"),
            Symptom(symptom="Symptoms appear first on lower, shaded leaves")
        ],
        treatment=[
            Treatment(treatment="Use fungicides containing copper, sulfur, or mancozeb"),
            Treatment(treatment="Remove and destroy infected leaves and canes"),
            Treatment(treatment="Apply fungicides preventively during wet, warm weather")
        ],
        prevention=[
            Prevention(prevention="Prune vines to improve air circulation and reduce humidity"),
            Prevention(prevention="Avoid overhead irrigation"),
            Prevention(prevention="Use disease-resistant grape cultivars when available"),
            Prevention(prevention="Practice regular sanitation and remove leaf litter after harvest")
        ]
    )

    leaf_blight_grape.species_affected = [
        SpeciesAffected(species="Vitis vinifera"),
        SpeciesAffected(species="Vitis labrusca"),
        SpeciesAffected(species="Vitis riparia"),
        SpeciesAffected(species="Wild grape species")
    ]

    # Create Disease object
    black_rot_grape = Disease(
        name="Grape: Black Rot",
        cause="Fungal (Guignardia bidwellii)",
        severity="High; can cause complete crop loss if left unmanaged",
        symptoms=[
            Symptom(symptom="Circular brown lesions on leaves with dark borders"),
            Symptom(symptom="Black rot on fruit: sunken brown lesions that turn into hard, black mummified berries"),
            Symptom(symptom="Infected shoots show black cankers"),
            Symptom(symptom="Can significantly affect yield if not managed")
        ],
        treatment=[
            Treatment(
                treatment="Apply fungicides like thiophanate-methyl, mancozeb, or copper compounds during the growing season"),
            Treatment(treatment="Remove and destroy all mummified fruit and infected debris"),
            Treatment(treatment="Prune out diseased wood during dormancy")
        ],
        prevention=[
            Prevention(prevention="Plant resistant cultivars if available"),
            Prevention(prevention="Maintain open canopies through pruning to improve airflow"),
            Prevention(prevention="Avoid overhead watering and minimize leaf wetness"),
            Prevention(prevention="Use clean planting material and practice proper vineyard hygiene")
        ]
    )

    black_rot_grape.species_affected = [
        SpeciesAffected(species="Vitis vinifera"),
        SpeciesAffected(species="Vitis labrusca"),
        SpeciesAffected(species="Hybrids"),
        SpeciesAffected(species="Virginia creeper (Parthenocissus quinquefolia)")
    ]

    # Create Disease object
    esca_grape = Disease(
        name="Grape: Esca (Black Measles)",
        cause="Fungal complex (Fomitiporia mediterranea, Phaeoacremonium spp., Phaeomoniella chlamydospora)",
        severity="Severe; disease is chronic and can lead to long-term vine decline and death",
        symptoms=[
            Symptom(symptom="Leaf symptoms appear as interveinal chlorosis with tiger-stripe patterns"),
            Symptom(symptom="Dead leaf tissue between veins (necrosis)"),
            Symptom(symptom="Black streaks visible in wood after cutting stems (vascular discoloration)"),
            Symptom(symptom="Berry shriveling and poor ripening (in advanced stages)"),
            Symptom(symptom="Plant decline and sudden dieback in severe cases")
        ],
        treatment=[
            Treatment(treatment="No effective chemical treatment exists"),
            Treatment(treatment="Remove and destroy infected vines or severely affected wood"),
            Treatment(treatment="Perform trunk surgery in some cases (removal of diseased wood internally)")
        ],
        prevention=[
            Prevention(prevention="Avoid large pruning wounds during wet periods"),
            Prevention(prevention="Use sanitized pruning tools"),
            Prevention(prevention="Remove infected plant material from the vineyard"),
            Prevention(prevention="Avoid water stress, which predisposes plants to infection")
        ]
    )

    esca_grape.species_affected = [
        SpeciesAffected(species="Vitis vinifera"),
        SpeciesAffected(species="Vitis labrusca"),
        SpeciesAffected(species="Other woody vines occasionally affected")
    ]

    # Create Disease object
    cherry_powdery_mildew = Disease(
        name="Cherry: Powdery Mildew",
        cause="Fungal (Podosphaera clandestina)",
        severity="Moderate to severe, especially under warm, dry conditions with high humidity",
        symptoms=[
            Symptom(
                symptom="White to gray, powdery fungal growth on the upper surface of leaves, flower buds, stems, and young shoots"),
            Symptom(symptom="Leaves may become distorted, curled, or stunted"),
            Symptom(symptom="Severe infections can cause early leaf drop, reduced fruit set, and weakened trees"),
            Symptom(symptom="Infected buds may fail to open or produce malformed shoots")
        ],
        treatment=[
            Treatment(
                treatment="Apply fungicides such as sulfur, potassium bicarbonate, or myclobutanil early in the season and at regular intervals"),
            Treatment(treatment="Remove and destroy infected shoots and leaves"),
            Treatment(treatment="Prune trees to increase air circulation")
        ],
        prevention=[
            Prevention(prevention="Select resistant cherry cultivars when available"),
            Prevention(prevention="Avoid excessive nitrogen fertilization"),
            Prevention(prevention="Ensure good airflow by proper tree spacing and regular pruning"),
            Prevention(prevention="Sanitize tools and remove infected plant debris after the season")
        ]
    )

    cherry_powdery_mildew.species_affected = [
        SpeciesAffected(species="Prunus avium"),
        SpeciesAffected(species="Prunus cerasus"),
        SpeciesAffected(species="Peach, plum, and other Prunus species (occasionally)")
    ]

    # Create Disease object
    strawberry_leaf_scorch = Disease(
        name="Strawberry: Leaf Scorch",
        cause="Fungal (Diplocarpon earliana)",
        severity="Mild to moderate, but can reduce plant productivity significantly in wet seasons",
        symptoms=[
            Symptom(
                symptom="Irregular, reddish-brown spots on leaf margins that may expand and coalesce, giving a scorched appearance"),
            Symptom(symptom="Leaf tips and edges may die back; affected leaves eventually dry out and fall off"),
            Symptom(symptom="Symptoms often confused with drought or salt injury"),
            Symptom(symptom="Severely infected plants show reduced vigor and yield")
        ],
        treatment=[
            Treatment(treatment="Apply fungicides like captan or myclobutanil during periods of high humidity"),
            Treatment(treatment="Remove infected foliage and avoid working with wet plants"),
            Treatment(treatment="Improve irrigation practices to avoid leaf wetness")
        ],
        prevention=[
            Prevention(prevention="Use resistant or tolerant strawberry varieties"),
            Prevention(prevention="Space plants adequately to allow airflow"),
            Prevention(prevention="Employ drip irrigation instead of overhead watering"),
            Prevention(prevention="Remove old plant debris and infected leaves from the field")
        ]
    )

    strawberry_leaf_scorch.species_affected = [
        SpeciesAffected(species="Fragaria × ananassa"),
        SpeciesAffected(species="Fragaria virginiana"),
        SpeciesAffected(species="Fragaria vesca")
    ]

    # Create Disease object
    pepper_bacterial_spot = Disease(
        name="Bell Pepper: Bacterial Spot",
        cause="Bacterial (Xanthomonas campestris)",
        severity="High; can cause significant crop loss under favorable (warm, wet) conditions",
        symptoms=[
            Symptom(symptom="Small, water-soaked, greasy lesions on leaves, stems, and fruit"),
            Symptom(symptom="Lesions enlarge and turn dark brown to black, often with a yellow halo"),
            Symptom(symptom="Leaf spots may coalesce, leading to blighting and premature defoliation"),
            Symptom(symptom="On fruit, spots are raised, scab-like, and may cause unmarketable blemishes"),
            Symptom(symptom="Can lead to secondary infections and fruit rot")
        ],
        treatment=[
            Treatment(treatment="Apply copper-based bactericides or streptomycin (where legally permitted)"),
            Treatment(treatment="Remove infected plant parts and dispose of them away from the field"),
            Treatment(treatment="Disinfect tools and equipment between uses")
        ],
        prevention=[
            Prevention(prevention="Use certified disease-free seed and resistant cultivars"),
            Prevention(prevention="Avoid overhead irrigation and splashing water"),
            Prevention(prevention="Rotate crops with non-solanaceous plants for at least two years"),
            Prevention(prevention="Control weeds and volunteer solanaceous plants that can harbor the bacteria")
        ]
    )

    pepper_bacterial_spot.species_affected = [
        SpeciesAffected(species="Capsicum annuum"),
        SpeciesAffected(species="Capsicum frutescens"),
        SpeciesAffected(species="Solanum lycopersicum"),
        SpeciesAffected(species="Solanum melongena")
    ]

    # Create Disease object
    bell_pepper_phytophthora_blight = Disease(
        name="Bell Pepper: Phytophthora Blight",
        cause="Soilborne oomycete pathogen Phytophthora capsici",
        severity="High; can cause rapid plant death and significant yield loss, especially in poorly drained soils.",
        symptoms=[
            Symptom(symptom="Sudden wilting of plants without yellowing of leaves."),
            Symptom(symptom="Dark brown lesions at the soil line that may girdle the stem."),
            Symptom(symptom="Water-soaked fruit lesions that become covered with white, cottony mold.")
        ],
        treatment=[
            Treatment(treatment="Plant in well-drained soils and use raised beds with plastic mulch."),
            Treatment(treatment="Avoid using surface water for irrigation; opt for drip irrigation systems."),
            Treatment(treatment="Rotate crops with non-host species like cereals."),
            Treatment(treatment="Remove and destroy infected plants and fruits promptly."),
            Treatment(treatment="Sanitize equipment and tools to prevent pathogen spread.")
        ],
        prevention=[
            Prevention(prevention="Plant in well-drained soils and use raised beds with plastic mulch."),
            Prevention(prevention="Avoid using surface water for irrigation; opt for drip irrigation systems."),
            Prevention(prevention="Rotate crops with non-host species like cereals."),
            Prevention(prevention="Remove and destroy infected plants and fruits promptly."),
            Prevention(prevention="Sanitize equipment and tools to prevent pathogen spread.")
        ]
    )

    bell_pepper_phytophthora_blight.species_affected = [
        SpeciesAffected(species="Capsicum annuum"),
        SpeciesAffected(species="Capsicum frutescens"),
        SpeciesAffected(species="Solanum lycopersicum"),
        SpeciesAffected(species="Solanum melongena"),
        SpeciesAffected(species="Cucurbits")
    ]

    # Create Disease object for Huanglongbing
    huanglongbing = Disease(
        name="Orange: Huanglongbing (Citrus Greening)",
        cause="Bacterial infection by Candidatus Liberibacter species, transmitted by the Asian citrus psyllid (Diaphorina citri)",
        severity="High; HLB is considered one of the most devastating citrus diseases worldwide. It leads to significant yield losses, tree decline, and eventual death. The disease has severely impacted citrus industries in affected regions, with no effective cure currently available.",
        symptoms=[
            Symptom(symptom="Yellowing of leaf veins and adjacent tissues, leading to blotchy mottling."),
            Symptom(symptom="Premature leaf drop and twig dieback."),
            Symptom(symptom="Stunted tree growth and reduced vigor."),
            Symptom(symptom="Small, misshapen fruits with a thick, pale peel that remains green at the bottom."),
            Symptom(symptom="Fruits have a bitter taste and are often misshapen."),
            Symptom(symptom="Asymmetrical yellowing distinguishes it from nutrient deficiencies.")
        ],
        treatment=[
            Treatment(treatment="There is currently no cure for HLB."),
            Treatment(treatment="Removal and destruction of infected trees to prevent spread."),
            Treatment(treatment="Application of insecticides to control psyllid populations."),
            Treatment(treatment="Use of antibiotics and heat treatments are under research but not widely adopted.")
        ],
        prevention=[
            Prevention(prevention="Plant certified disease-free nursery stock."),
            Prevention(
                prevention="Implement strict quarantine measures to prevent the introduction of infected material."),
            Prevention(prevention="Regular monitoring and early detection of psyllid populations."),
            Prevention(
                prevention="Use of insect-proof netting and biological control agents to manage psyllid vectors."),
            Prevention(prevention="Public awareness and education programs to identify and report symptoms early.")
        ]
    )

    huanglongbing.species_affected = [
        SpeciesAffected(species="Citrus × sinensis"),
        SpeciesAffected(species="Other citrus species including lemon, lime, grapefruit, and mandarin")
    ]

    # Create Disease object for Squash: Powdery Mildew
    squash_powdery_mildew = Disease(
        name="Squash: Powdery Mildew",
        cause="Fungal infection primarily by Podosphaera xanthii and Erysiphe cichoracearum.",
        severity="Moderate to High; if left untreated, powdery mildew can significantly reduce photosynthesis, leading to decreased yields and plant death.",
        symptoms=[
            Symptom(symptom="White to grayish powdery spots on leaves and stems."),
            Symptom(symptom="Spots may enlarge, covering entire leaf surfaces."),
            Symptom(symptom="Infected leaves may turn yellow, curl, and eventually die."),
            Symptom(symptom="Reduced plant vigor and fruit yield.")
        ],
        treatment=[
            Treatment(treatment="Apply sulfur-based fungicides (use with caution in high temperatures)."),
            Treatment(treatment="Use neem oil or potassium bicarbonate sprays."),
            Treatment(treatment="Homemade remedies like a milk and water mixture (40:60 ratio)."),
            Treatment(treatment="Use fungicides containing chlorothalonil, myclobutanil, or triflumizole."),
            Treatment(treatment="Rotate fungicides to prevent resistance development.")
        ],
        prevention=[
            Prevention(prevention="Plant resistant squash varieties when available."),
            Prevention(prevention="Ensure proper spacing for air circulation."),
            Prevention(prevention="Avoid overhead watering to reduce humidity."),
            Prevention(prevention="Remove and destroy infected plant debris promptly."),
            Prevention(prevention="Implement crop rotation with non-cucurbit plants.")
        ]
    )

    squash_powdery_mildew.species_affected = [
        SpeciesAffected(species="Cucurbita spp. (including zucchini, yellow squash, and pattypan)"),
        SpeciesAffected(species="Other cucurbits like cucumbers, melons, and pumpkins")
    ]

    # Create Disease object for Potato: Late Blight
    potato_late_blight = Disease(
        name="Potato: Late Blight",
        cause="Late blight is caused by Phytophthora infestans, a pathogen that spreads rapidly through airborne spores and water splash. It can infect plants at any stage of growth and is notorious for causing the Irish Potato Famine in the 1840s.",
        severity="High. Late blight can cause rapid and complete destruction of potato foliage and tubers, leading to significant yield losses. Under favorable conditions, entire fields can be devastated within days.",
        symptoms=[
            Symptom(
                symptom="Water-soaked lesions on leaves that rapidly enlarge and turn brown or black, often with a yellowish halo."),
            Symptom(
                symptom="White, fuzzy fungal growth (sporangia) may appear on the undersides of leaves under humid conditions."),
            Symptom(symptom="Stems develop dark brown to black lesions, leading to collapse."),
            Symptom(symptom="Tubers exhibit firm, brown, granular rot that can extend into the flesh.")
        ],
        treatment=[
            Treatment(
                treatment="Apply fungicides preventatively and continue applications at 5- to 7-day intervals during conducive conditions. Effective fungicides include chlorothalonil, mancozeb, and products containing cyazofamid or dimethomorph."),
            Treatment(treatment="Remove and destroy infected plants promptly."),
            Treatment(treatment="Avoid overhead irrigation to minimize leaf wetness.")
        ],
        prevention=[
            Prevention(prevention="Plant certified disease-free seed potatoes."),
            Prevention(
                prevention="Implement crop rotation, avoiding planting potatoes or tomatoes in the same location for at least two years."),
            Prevention(prevention="Ensure proper spacing and staking to improve air circulation."),
            Prevention(
                prevention="Monitor weather conditions and apply fungicides proactively during periods of high risk.")
        ]
    )

    potato_late_blight.species_affected = [
        SpeciesAffected(species="Potato (Solanum tuberosum)"),
        SpeciesAffected(species="Tomato (Solanum lycopersicum)"),
        SpeciesAffected(species="Other Solanaceae family members")
    ]

    # Create Disease object for Potato: Early Blight
    potato_early_blight = Disease(
        name="Potato: Early Blight",
        cause="Early blight is caused by the fungus Alternaria solani, which survives in infected plant debris and soil. The pathogen spreads through wind, rain splash, and mechanical means, infecting plants through wounds or natural openings.",
        severity="Moderate to High. Early blight can cause significant yield losses, especially under favorable environmental conditions. The disease leads to premature defoliation, reducing photosynthetic capacity and tuber quality. In severe cases, yield losses can reach up to 30%.",
        symptoms=[
            Symptom(symptom="Initial symptoms appear as small, dark, dry spots on older leaves."),
            Symptom(symptom="Lesions enlarge, forming concentric rings, giving a 'target' or 'bullseye' appearance."),
            Symptom(symptom="Surrounding tissue may turn yellow, leading to leaf drop."),
            Symptom(symptom="Stem lesions are dark and sunken, potentially girdling the stem."),
            Symptom(symptom="Infected tubers exhibit dark, sunken lesions with dry, corky rot.")
        ],
        treatment=[
            Treatment(
                treatment="Apply fungicides preventatively, especially during favorable conditions for the disease."),
            Treatment(
                treatment="Effective fungicides include chlorothalonil, mancozeb, azoxystrobin, and copper-based products."),
            Treatment(treatment="Rotate fungicides with different modes of action to prevent resistance development."),
            Treatment(treatment="Remove and destroy infected plant debris promptly."),
            Treatment(treatment="Avoid overhead irrigation to minimize leaf wetness."),
            Treatment(treatment="Ensure adequate plant spacing to improve air circulation.")
        ],
        prevention=[
            Prevention(prevention="Use certified disease-free seed potatoes."),
            Prevention(
                prevention="Implement crop rotation, avoiding planting potatoes or tomatoes in the same location for at least two years."),
            Prevention(prevention="Maintain balanced soil fertility to reduce plant stress."),
            Prevention(prevention="Control weeds and volunteer Solanaceous plants that can harbor the pathogen.")
        ]
    )

    potato_early_blight.species_affected = [
        SpeciesAffected(species="Potato (Solanum tuberosum)"),
        SpeciesAffected(species="Tomato (Solanum lycopersicum)"),
        SpeciesAffected(species="Eggplant (Solanum melongena)"),
        SpeciesAffected(species="Peppers (Capsicum spp.)"),
        SpeciesAffected(species="Other Solanaceae family members")
    ]

    # Create Disease object for Corn (maize): Northern Corn Leaf Blight (NCLB)
    corn_nclb = Disease(
        name="Corn (maize): Northern Corn Leaf Blight",
        cause="NCLB is caused by the fungus Exserohilum turcicum, which overwinters on corn leaf debris. The pathogen produces spores that are dispersed by wind and rain, infecting new plants under favorable conditions.",
        severity="High; NCLB can cause significant yield loss in susceptible corn hybrids. Severe outbreaks of the disease can cause up to 30–50% yield loss in dent corn if the disease is established before tassel.",
        symptoms=[
            Symptom(
                symptom="Initial symptoms appear as small, light-green to grayish spots approximately 1–2 weeks after infection."),
            Symptom(
                symptom="Lesions expand into long, narrow, tan to gray 'cigar-shaped' lesions, typically 1–6 inches in length."),
            Symptom(
                symptom="Lesions may coalesce, covering large leaf areas, leading to significant loss of photosynthetic tissue."),
            Symptom(symptom="In severe cases, leaves may appear prematurely dead or gray, resembling frost damage.")
        ],
        treatment=[
            Treatment(
                treatment="Fungicides: Application of fungicides may be warranted, especially on susceptible hybrids. Fungicides should be applied during the early stages of the disease.")
        ],
        prevention=[
            Prevention(prevention="Use resistant hybrids to reduce the risk of infection."),
            Prevention(prevention="Implement crop rotation and tillage practices to reduce inoculum levels."),
            Prevention(prevention="Monitor fields regularly for early detection and management.")
        ]
    )

    corn_nclb.species_affected = [
        SpeciesAffected(species="Corn (Zea mays)")
    ]

    # Create Disease object for Corn (maize): Gray Leaf Spot (GLS)
    corn_gls = Disease(
        name="Corn (maize): Gray Leaf Spot",
        cause="GLS is caused by the fungus Cercospora zeae-maydis, which overwinters on corn leaf debris. The pathogen produces spores that are dispersed by wind and rain, infecting new plants under favorable conditions.",
        severity="High; GLS can cause significant yield loss in susceptible corn hybrids. Severe outbreaks of the disease can cause up to 30–50% yield loss in dent corn if the disease is established before tassel.",
        symptoms=[
            Symptom(symptom="Initial symptoms are small, pinpoint, olive-green spots on lower leaves."),
            Symptom(
                symptom="Lesions expand into long (up to 2 inches), narrow, rectangular, light tan to gray spots, typically confined between leaf veins."),
            Symptom(symptom="In severe infections, leaves may appear prematurely dead or gray.")
        ],
        treatment=[
            Treatment(
                treatment="Fungicides: Application of fungicides may be warranted, especially on susceptible hybrids. Fungicides should be applied during the early stages of the disease.")
        ],
        prevention=[
            Prevention(prevention="Use resistant hybrids to reduce the risk of infection."),
            Prevention(prevention="Implement crop rotation and tillage practices to reduce inoculum levels."),
            Prevention(prevention="Monitor fields regularly for early detection and management.")
        ]
    )

    corn_gls.species_affected = [
        SpeciesAffected(species="Corn (Zea mays)")
    ]

    # Create Disease object for Peach: Bacterial Spot
    peach_bacterial_spot = Disease(
        name="Peach: Bacterial Spot",
        cause="The bacterium Xanthomonas arboricola pv. pruni survives in twig cankers and infected buds. It spreads via wind-driven rain, splashing water, and contaminated tools, especially during wet, warm weather.",
        severity="High; bacterial spot can cause significant yield losses, especially in susceptible cultivars under favorable environmental conditions. Severe infections can lead to premature defoliation, fruit drop, and reduced tree vigor.",
        symptoms=[
            Symptom(
                symptom="Leaves: Small, angular, water-soaked spots that may turn reddish-brown and eventually fall out, giving a 'shot-hole' appearance."),
            Symptom(
                symptom="Fruits: Sunken, dark lesions that can crack and exude gum, leading to unmarketable fruit."),
            Symptom(symptom="Twigs: Cankers that may ooze gum, potentially leading to dieback.")
        ],
        treatment=[
            Treatment(
                treatment="Chemical Control: Application of bactericides, such as copper-based compounds or oxytetracycline, starting at the late dormant stage through shuck split. Care must be taken to avoid phytotoxicity.")
        ],
        prevention=[
            Prevention(prevention="Plant resistant cultivars when available."),
            Prevention(prevention="Implement proper pruning to improve air circulation."),
            Prevention(prevention="Avoid overhead irrigation to reduce leaf wetness."),
            Prevention(prevention="Remove and destroy infected plant material to reduce inoculum sources.")
        ]
    )

    peach_bacterial_spot.species_affected = [
        SpeciesAffected(species="Peach (Prunus persica)"),
        SpeciesAffected(species="Nectarine"),
        SpeciesAffected(species="Apricot"),
        SpeciesAffected(species="Plum")
    ]

    # Create Disease object for Tomato: Late Blight
    tomato_late_blight = Disease(
        name="Tomato: Late Blight",
        cause="Fungal (Phytophthora infestans)",
        severity="Severe; can result in total crop loss within days if not controlled, especially during wet weather.",
        symptoms=[
            Symptom(symptom="Large, irregular, water-soaked lesions on leaves that quickly turn brown and papery"),
            Symptom(
                symptom="White, fuzzy mold (sporangia) may appear on the undersides of infected leaves under humid conditions"),
            Symptom(symptom="Stems develop dark brown to black greasy-looking lesions that can girdle and kill them"),
            Symptom(symptom="Fruit develops firm, brown, greasy lesions which may lead to soft rot"),
            Symptom(
                symptom="Rapid disease progression can lead to total plant collapse within days under ideal conditions")
        ],
        treatment=[
            Treatment(
                treatment="Apply fungicides with active ingredients such as chlorothalonil, mancozeb, or copper-based products at first signs of disease"),
            Treatment(
                treatment="In severe cases, systemic fungicides like fluopicolide, cymoxanil, or mandipropamid may be used"),
            Treatment(treatment="Immediately remove and destroy infected plant material—do not compost"),
            Treatment(treatment="Monitor crops closely and apply protective sprays during periods of high risk")
        ],
        prevention=[
            Prevention(prevention="Use resistant or tolerant tomato varieties when available"),
            Prevention(
                prevention="Practice crop rotation and do not plant tomatoes or potatoes in the same location more than once every 3–4 years"),
            Prevention(prevention="Avoid overhead irrigation and water early in the day to allow foliage to dry"),
            Prevention(prevention="Provide good air circulation by proper plant spacing and pruning lower foliage"),
            Prevention(prevention="Destroy volunteer tomato and potato plants, which can harbor the pathogen"),
            Prevention(prevention="Keep the garden free of plant debris and solanaceous weeds")
        ]
    )

    tomato_late_blight.species_affected = [
        SpeciesAffected(species="Tomato (Solanum lycopersicum)"),
        SpeciesAffected(species="Potato (Solanum tuberosum)"),
        SpeciesAffected(species="Eggplant (Solanum melongena)"),
        SpeciesAffected(species="Petunia (Petunia spp.)"),
        SpeciesAffected(species="Other Solanaceae family members (rare)")
    ]

    # Create Disease object for Corn: Common Rust
    corn_common_rust = Disease(
        name="Corn (maize): Common Rust",
        cause="Fungal (Puccinia sorghi)",
        severity="Usually low to moderate; can become severe in susceptible hybrids under favorable conditions.",
        symptoms=[
            Symptom(symptom="Small, round to oval cinnamon-brown pustules on both upper and lower leaf surfaces"),
            Symptom(symptom="Leaves may yellow and die prematurely under heavy infection"),
            Symptom(symptom="Reduced photosynthesis and yield")
        ],
        treatment=[
            Treatment(
                treatment="Apply fungicides like azoxystrobin, pyraclostrobin, or propiconazole when disease reaches threshold levels"),
            Treatment(treatment="Monitor regularly to time applications correctly")
        ],
        prevention=[
            Prevention(prevention="Plant resistant hybrids"),
            Prevention(prevention="Rotate crops and manage residue to reduce overwintering spores"),
            Prevention(prevention="Avoid excessive irrigation and ensure plant spacing")
        ]
    )

    corn_common_rust.species_affected = [
        SpeciesAffected(species="Corn (maize) (Zea mays)")
    ]

    # Create Disease object for Apple: Apple Scab
    apple_scab = Disease(
        name="Apple: Apple Scab",
        cause="Fungal (Venturia inaequalis)",
        severity="Moderate to severe, depending on weather and cultivar",
        symptoms=[
            Symptom(symptom="Olive-green to brown velvety spots on the underside of leaves"),
            Symptom(symptom="Leaves may curl, distort, and fall prematurely"),
            Symptom(symptom="Fruit shows dark, sunken, scabby lesions that can crack"),
            Symptom(symptom="Severe infections reduce fruit yield and tree vigor")
        ],
        treatment=[
            Treatment(
                treatment="Apply fungicides such as myclobutanil, captan, or mancozeb at bud break and during early fruit development"),
            Treatment(treatment="Prune infected branches and remove fallen debris"),
            Treatment(treatment="Apply dormant sprays in late winter")
        ],
        prevention=[
            Prevention(prevention="Plant resistant apple cultivars (e.g., Liberty, Freedom)"),
            Prevention(prevention="Rake and dispose of fallen leaves"),
            Prevention(prevention="Prune for air circulation and avoid overhead irrigation")
        ]
    )

    apple_scab.species_affected = [
        SpeciesAffected(species="Apple (Malus domestica)"),
        SpeciesAffected(species="Crabapple (Malus spp.)")
    ]

    # Create Disease object for Apple: Black Rot
    apple_black_rot = Disease(
        name="Apple: Black Rot",
        cause="Fungal (Botryosphaeria obtusa)",
        severity="Can be severe if unmanaged",
        symptoms=[
            Symptom(symptom="Purple-brown leaf spots with concentric rings (“frog-eye” lesions)"),
            Symptom(symptom="Fruit rot begins as small, dark spots, enlarging into firm, black rotted areas"),
            Symptom(symptom="Cankers form on branches, often girdling them and causing dieback")
        ],
        treatment=[
            Treatment(treatment="Remove and destroy infected fruit, leaves, and limbs"),
            Treatment(treatment="Apply fungicides like captan or thiophanate-methyl during the growing season"),
            Treatment(treatment="Prune cankers during dormancy")
        ],
        prevention=[
            Prevention(prevention="Maintain tree vigor through proper fertilization and watering"),
            Prevention(prevention="Avoid wounding the tree"),
            Prevention(prevention="Clean up orchard debris regularly")
        ]
    )

    apple_black_rot.species_affected = [
        SpeciesAffected(species="Apple (Malus domestica)"),
        SpeciesAffected(species="Crabapple (Malus spp.)")
    ]

    # Create Disease object for Apple: Cedar Apple Rust
    apple_cedar_apple_rust = Disease(
        name="Apple: Cedar Apple Rust",
        cause="Fungal (Gymnosporangium juniperi-virginianae)",
        severity="Moderate; most damaging in humid climates",
        symptoms=[
            Symptom(symptom="Yellow-orange leaf spots on apple in spring"),
            Symptom(symptom="Fruit may show small, sunken lesions"),
            Symptom(symptom="On cedar, produces gelatinous orange galls during wet spring weather")
        ],
        treatment=[
            Treatment(
                treatment="Apply fungicides such as myclobutanil or propiconazole during early bud stages on apple"),
            Treatment(treatment="Remove cedar hosts within 300–500 feet if possible")
        ],
        prevention=[
            Prevention(prevention="Use resistant apple varieties (e.g., Redfree, Liberty)"),
            Prevention(prevention="Prune out galls from nearby juniper species"),
            Prevention(prevention="Ensure good airflow and sanitation")
        ]
    )

    apple_cedar_apple_rust.species_affected = [
        SpeciesAffected(species="Apple (Malus domestica)"),
        SpeciesAffected(species="Crabapple (Malus spp.)"),
        SpeciesAffected(species="Eastern red cedar (Juniperus virginiana) and other Juniperus species")
    ]

    # Create Disease object for Healthy (No Disease Detected)
    healthy = Disease(
        name="Healthy",
        cause="None detected",
        severity="None",
        symptoms=[
            Symptom(symptom="No visible signs of disease or abnormality observed")
        ],
        treatment=[
            Treatment(treatment="No treatment necessary")
        ],
        prevention=[
            Prevention(prevention="Continue standard good agricultural practices to maintain plant health")
        ]
    )

    healthy.species_affected = [
        SpeciesAffected(species="No diseases detected")
    ]

    # Create Disease object for Unknown (Cause/Severity Unidentified)
    unknown = Disease(
        name="Plant unidentified",
        cause="Cause undetermined",
        severity="Severity undetermined",
        symptoms=[
            Symptom(symptom="Symptoms present but not fully identified")
        ],
        treatment=[
            Treatment(treatment="Treatment pending diagnosis")
        ],
        prevention=[
            Prevention(prevention="Prevention strategies to be determined based on diagnosis")
        ]
    )

    unknown.species_affected = [
        SpeciesAffected(species="Uncertain; further investigation needed")
    ]

    with DB.SessionLocal as session:
        session.add(unknown)
        session.commit()


