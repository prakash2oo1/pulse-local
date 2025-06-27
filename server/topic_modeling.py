from gensim import corpora, models

def cluster_topics(texts):
    # Tokenize the texts
    tokenized_texts = [text.lower().split() for text in texts]

    # Create a dictionary and corpus
    dictionary = corpora.Dictionary(tokenized_texts)
    corpus = [dictionary.doc2bow(text) for text in tokenized_texts]

    # Apply LDA model
    lda_model = models.LdaModel(corpus, num_topics=3, id2word=dictionary, passes=15)

    # Extract topics
    topics = lda_model.print_topics(num_words=5)
    return [{'topic': topic[0], 'terms': topic[1]} for topic in topics]
